import { VercelRequest, VercelResponse } from '@vercel/node';
import { getPlaylistTracks } from '../lib/spotify';
import { addMagnet, selectFiles } from '../lib/debrid';
import { search, TrackInfo } from '../lib/trackers';

interface TrackResult {
  spotifyTrackId: string;
  name: string;
  artists: string[];
  album: string;
  spotifyUrl: string;
  durationMs: number;
  status: 'added' | 'not_found' | 'error';
  debridTorrentId?: string;
  rawMetadata: Record<string, unknown>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { playlistId, accessToken, debridToken, trackers } = req.body as {
    playlistId?: string;
    accessToken?: string;
    debridToken?: string;
    trackers?: string[];
  };

  if (!playlistId || !accessToken || !debridToken) {
    res.status(400).json({
      error: 'playlistId, accessToken, and debridToken are required',
    });
    return;
  }

  try {
    const items = await getPlaylistTracks(accessToken, playlistId);

    const results: TrackResult[] = [];

    for (const item of items) {
      const t = item.track;
      if (!t) continue;

      const trackInfo: TrackInfo = {
        name: t.name,
        artists: t.artists.map((a) => ({ name: a.name })),
        album: t.album ? { name: t.album.name } : undefined,
      };

      const trackResult: TrackResult = {
        spotifyTrackId: t.id || '',
        name: t.name,
        artists: t.artists.map((a) => a.name),
        album: t.album?.name || '',
        spotifyUrl: t.external_urls?.spotify || '',
        durationMs: t.duration_ms || 0,
        status: 'not_found',
        rawMetadata: {
          id: t.id,
          name: t.name,
          artists: t.artists.map((a) => ({ name: a.name, id: a.id })),
          album: t.album ? { name: t.album.name, id: t.album.id, images: t.album.images } : null,
          duration_ms: t.duration_ms,
          track_number: t.track_number,
          disc_number: t.disc_number,
          explicit: t.explicit,
          external_urls: t.external_urls,
          preview_url: t.preview_url,
        },
      };

      try {
        const magnet = await search(trackInfo, trackers || []);
        if (magnet) {
          const addResult = await addMagnet(magnet, debridToken);
          // Select all files so debrid starts downloading
          try {
            await selectFiles(addResult.id, debridToken);
          } catch {
            // Non-fatal: some torrents auto-select
          }
          trackResult.status = 'added';
          trackResult.debridTorrentId = addResult.id;
        }
      } catch (err) {
        console.error(`Error processing track ${t.name}:`, err);
        trackResult.status = 'error';
      }

      results.push(trackResult);
    }

    res.status(200).json({ total: items.length, results });
  } catch (err) {
    console.error('Import error:', err);
    res.status(500).json({ error: 'Import failed' });
  }
}
