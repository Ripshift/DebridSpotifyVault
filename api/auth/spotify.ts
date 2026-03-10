import { VercelRequest, VercelResponse } from '@vercel/node';
import { getAuthorizationUrl } from '../../lib/spotify';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const authUrl = getAuthorizationUrl();
    res.redirect(authUrl);
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Authorization failed' });
  }
}
