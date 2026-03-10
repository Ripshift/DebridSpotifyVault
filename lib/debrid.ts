import axios from 'axios';

const BASE = 'https://api.real-debrid.com/rest/1.0';

interface AddMagnetResponse {
  id: string;
  uri: string;
}

export const addMagnet = async (magnet: string): Promise<AddMagnetResponse> => {
  const token = process.env.REALDEBRID_API_KEY;
  if (!token) {
    throw new Error('REALDEBRID_API_KEY is not set');
  }

  const response = await axios.post<AddMagnetResponse>(
    `${BASE}/torrents/addMagnet`,
    `magnet=${encodeURIComponent(magnet)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data;
};
