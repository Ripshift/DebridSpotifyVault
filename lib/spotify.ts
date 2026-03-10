import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID || 'default_client_id',
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET || 'default_client_secret',
  redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/callback',
});

export const getAuthorizationUrl = (): string => {
  const scopes = ['playlist-read-private'];
  return spotifyApi.createAuthorizeURL(scopes, 'state');
};

export const exchangeCodeForToken = async (code: string) => {
  const data = await spotifyApi.authorizationCodeGrant(code);
  return {
    accessToken: data.body['access_token'],
    refreshToken: data.body['refresh_token'],
    expiresIn: data.body['expires_in'],
  };
};

export const getPlaylistTracks = async (
  accessToken: string,
  playlistId: string
): Promise<SpotifyApi.PlaylistTrackObject[]> => {
  const api = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID || 'default_client_id',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || 'default_client_secret',
  });
  api.setAccessToken(accessToken);

  const tracks: SpotifyApi.PlaylistTrackObject[] = [];
  let offset = 0;
  while (true) {
    const data = await api.getPlaylistTracks(playlistId, {
      offset,
      limit: 100,
    });
    tracks.push(...data.body.items);
    if (data.body.next) {
      offset += 100;
    } else {
      break;
    }
  }
  return tracks;
};

export const getPlaylistInfo = async (
  accessToken: string,
  playlistId: string,
): Promise<{
  id: string;
  name: string;
  description: string;
  owner: string;
  imageUrl: string;
  totalTracks: number;
  spotifyUrl: string;
}> => {
  const api = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID || 'default_client_id',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || 'default_client_secret',
  });
  api.setAccessToken(accessToken);

  const data = await api.getPlaylist(playlistId);
  const p = data.body;
  
  if (!p) {
    throw new Error('Playlist not found or not accessible');
  }

  return {
    id: p.id || playlistId,
    name: p.name || 'Untitled Playlist',
    description: p.description || '',
    owner: p.owner?.display_name || p.owner?.id || 'Unknown',
    imageUrl: p.images?.[0]?.url || '',
    totalTracks: p.tracks?.total || 0,
    spotifyUrl: p.external_urls?.spotify || `https://open.spotify.com/playlist/${playlistId}`,
  };
};
