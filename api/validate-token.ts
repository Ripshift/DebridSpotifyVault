import { VercelRequest, VercelResponse } from '@vercel/node';
import { validateToken } from '../lib/debrid';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { token } = req.body as { token?: string };
  if (!token) {
    res.status(400).json({ error: 'token is required' });
    return;
  }

  try {
    const user = await validateToken(token);
    res.status(200).json({ valid: true, ...user });
  } catch {
    res.status(401).json({ valid: false, error: 'Invalid API token' });
  }
}
