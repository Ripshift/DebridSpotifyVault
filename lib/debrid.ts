import axios from 'axios';

const BASE = 'https://api.real-debrid.com/rest/1.0';

interface AddMagnetResponse {
  id: string;
  uri: string;
}

interface TorrentInfo {
  id: string;
  filename: string;
  status: string;
  links: string[];
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

/**
 * Add a magnet link to Real-Debrid.
 * @param token  Real-Debrid API token (passed from client)
 * @param magnet Magnet URI
 */
export const addMagnet = async (
  magnet: string,
  token?: string,
): Promise<AddMagnetResponse> => {
  const apiKey = token || process.env.REALDEBRID_API_KEY;
  if (!apiKey) {
    throw new Error('Real-Debrid API token is required');
  }

  const response = await axios.post<AddMagnetResponse>(
    `${BASE}/torrents/addMagnet`,
    `magnet=${encodeURIComponent(magnet)}`,
    {
      headers: {
        ...authHeaders(apiKey),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
  return response.data;
};

/**
 * Select all files in a torrent so Real-Debrid starts downloading.
 */
export const selectFiles = async (
  torrentId: string,
  token: string,
): Promise<void> => {
  await axios.post(
    `${BASE}/torrents/selectFiles/${torrentId}`,
    'files=all',
    {
      headers: {
        ...authHeaders(token),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
};

/**
 * Get torrent info (status, links, etc.)
 */
export const getTorrentInfo = async (
  torrentId: string,
  token: string,
): Promise<TorrentInfo> => {
  const { data } = await axios.get<TorrentInfo>(
    `${BASE}/torrents/info/${torrentId}`,
    { headers: authHeaders(token) },
  );
  return data;
};

/**
 * Validate a Real-Debrid API token by fetching user info.
 * Returns the username on success, throws on failure.
 */
export const validateToken = async (token: string): Promise<{ username: string; email: string; premium: number }> => {
  const { data } = await axios.get(`${BASE}/user`, {
    headers: authHeaders(token),
  });
  return { username: data.username, email: data.email, premium: data.premium };
};
