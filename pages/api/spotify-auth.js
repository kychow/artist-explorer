import { SPOTIFY_API_AUTH_URL, SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from './artists';

export default function handler(req, res) {
  const authUrl = `${SPOTIFY_API_AUTH_URL}?response_type=code&client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=user-top-read`;

  res.redirect(307, authUrl);
}
