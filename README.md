# Debridify

A service that takes a Spotify playlist and adds matching torrents to a Real-Debrid account via public trackers.

**Deployed on Vercel** – Runs as serverless functions on the edge with a beautiful web UI.

## Features

- 🎵 **Spotify Integration** – Browse and import your playlists
- 📥 **Real-Debrid Support** – Add torrents directly to your account
- 🔍 **Multi-Tracker Search** – Search across multiple public torrent trackers
- ☑️ **Configurable Trackers** – Enable/disable trackers as needed
- 🎨 **Beautiful UI** – Modern, responsive landing page

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with (required for local development):
   ```ini
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REDIRECT_URI=http://localhost:3000/api/callback
   ```

3. Run locally with Vercel CLI:
   ```bash
   npm run dev
   ```
   Access at `http://localhost:3000`

## Deployment to Vercel

1. Push repo to GitHub
2. Connect to [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REDIRECT_URI=https://your-project.vercel.app/api/callback`
4. Deploy automatically on push or run:
   ```bash
   npm run deploy
   ```

## How It Works

1. **Landing Page** (`/`) – Enter your Real-Debrid API token and select trackers
2. **Spotify Auth** – Authorize access to your playlists
3. **Select Playlist** – Choose a playlist ID or authorize via Spotify
4. **Import** – The service fetches tracks and searches for matching torrents across enabled trackers
5. **Results** – See which tracks were added to Real-Debrid and which weren't found

## API Endpoints

- `GET /` – Landing page UI
- `GET /api/auth/spotify` – Redirect to Spotify OAuth
- `GET /api/callback?code=...` – Spotify OAuth callback
- `POST /api/import` – Import playlist
  - Body:
    ```json
    {
      "playlistId": "spotify_playlist_id",
      "accessToken": "spotify_access_token",
      "debridToken": "your_realdebrid_api_key",
      "trackers": ["tracker1", "tracker2"]
    }
    ```
  - Response:
    ```json
    {
      "total": 50,
      "results": [
        { "track": "Artist – Song", "status": "added" },
        { "track": "Artist – Song", "status": "not_found" }
      ]
    }
    ```

## Trackers

Available trackers (configurable via UI):
- 1337x
- The Pirate Bay
- Kickass Torrents
- RARBG
- Nyaa (Anime)

## Technologies

- **TypeScript** – Type-safe code
- **Vercel** – Serverless deployment
- **Spotify Web API** – Playlist fetching
- **Real-Debrid API** – Torrent management
