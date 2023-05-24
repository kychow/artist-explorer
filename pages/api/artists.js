import axios from 'axios';

// Set up your credentials
export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
export const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
export const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

// Define API URLs
export const SPOTIFY_API_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_API_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_TOP_ARTISTS_URL = 'https://api.spotify.com/v1/me/top/artists';

// Fetch the access token from Spotify
async function fetchAccessToken(code) {
  try {
    const response = await axios.post(SPOTIFY_API_TOKEN_URL, new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    }), {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
    });

    // Return the access token
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw new Error('Error fetching access token');
  }
}

// Fetch top artists data from Spotify
async function fetchTopArtistsCall(accessToken) {
  try {
    const response = await axios.get(SPOTIFY_API_TOP_ARTISTS_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: 3,
        time_range: 'medium_term',
      },
    });

    // Return the top artists data
    return response.data.items;
  } catch (error) {
    console.error('Error fetching top artists:', error);
    throw new Error('Error fetching top artists');
  }
}

// Fetch top artists using an authorization code
export async function fetchTopArtists(code) {
  try {
    const accessToken = await fetchAccessToken(code);
    const topArtists = await fetchTopArtistsCall(accessToken);
    return topArtists;
  } catch (error) {
    console.error('Error fetching top artists using auth code:', error);
    throw new Error('Error fetching top artists using auth code');
  }
}

// Handle the callback from Spotify
export async function handleSpotifyCallback(req, res) {
  const { code } = req.query;

  try {
    const topArtists = await fetchTopArtists(code);
    // Encode the topArtists data as base64
    const base64TopArtists = Buffer.from(JSON.stringify(topArtists)).toString('base64');
    // Redirect to /callback with the topArtists data
    res.redirect(`/callback#${base64TopArtists}`);
  } catch (error) {
    console.error('Error handling Spotify callback:', error);
    res.status(500).json({ error: 'Error handling Spotify callback' });
  }
}

// Redirect the user to the Spotify authorization page
export default function handler(req, res) {
  const authUrl = `${SPOTIFY_API_AUTH_URL}?response_type=code&client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=user-top-read`;

  res.writeHead(302, { Location: authUrl });
  res.end();
}
