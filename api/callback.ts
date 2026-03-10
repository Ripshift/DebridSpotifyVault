import { VercelRequest, VercelResponse } from '@vercel/node';
import { exchangeCodeForToken } from '../lib/spotify';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const code = req.query.code as string | undefined;
  if (!code) {
    res.status(400).redirect('/?error=missing_code');
    return;
  }

  try {
    const tokens = await exchangeCodeForToken(code);
    // Redirect back to home with access token in query string
    // In production, you'd want to use secure session/cookie storage
    const redirectUrl = `/?accessToken=${encodeURIComponent(tokens.accessToken)}`;
    res.redirect(redirectUrl);
  } catch (err) {
    console.error('Spotify callback error:', err);
    res.status(302).redirect('/?error=auth_failed');
  }
}
