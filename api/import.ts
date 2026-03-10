import { VercelRequest, VercelResponse } from '@vercel/node';
import { getPlaylistTracks } from '../lib/spotify';
import { addMagnet } from '../lib/debrid';
import { search, TrackInfo } from '../lib/trackers';

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

    const results: { track: string; status: string }[] = [];

    for (const item of items) {
      const t = item.track;
      if (!t) continue;

      const trackInfo: TrackInfo = {
        name: t.name,
        artists: t.artists.map((a) => ({ name: a.name })),
        album: t.album ? { name: t.album.name } : undefined,
      };

      try {
        const magnet = await search(trackInfo, trackers || []);
        if (magnet) {
          // Override env var with user-provided Debrid token
          const originalKey = process.env.REALDEBRID_API_KEY;
          process.env.REALDEBRID_API_KEY = debridToken;
          try {
            await addMagnet(magnet);
            results.push({
              track: `${trackInfo.artists[0]?.name} – ${trackInfo.name}`,
              status: 'added',
            });
          } finally {
            process.env.REALDEBRID_API_KEY = originalKey;
          }
        } else {
          results.push({
            track: `${trackInfo.artists[0]?.name} – ${trackInfo.name}`,
            status: 'not_found',
          });
        }
      } catch (err) {
        console.error(`Error processing track ${t.name}:`, err);
        results.push({
          track: `${trackInfo.artists[0]?.name} – ${trackInfo.name}`,
          status: 'error',
        });
      }
    }

    res.status(200).json({ total: items.length, results });
  } catch (err) {
    console.error('Import error:', err);
    res.status(500).json({ error: 'Import failed' });
  }
}
