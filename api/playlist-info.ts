import { VercelRequest, VercelResponse } from '@vercel/node';
import { getPlaylistInfo } from '../lib/spotify';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { accessToken, playlistId } = req.body as {
    accessToken?: string;
    playlistId?: string;
  };

  if (!accessToken || !playlistId) {
    res.status(400).json({ error: 'accessToken and playlistId are required' });
    return;
  }

  try {
    const info = await getPlaylistInfo(accessToken, playlistId);
    res.status(200).json(info);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('Playlist info error:', errMsg, err);
    res.status(500).json({ error: 'Failed to fetch playlist info', details: errMsg });
  }
}
