'use client';

import React, { useEffect, useState } from 'react';
import ArtistExplorerGraph from './components/ArtistExplorerGraph'
import { SpotifyLoginButton } from './components/SpotifyLoginButton';

export default function Page() {
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    // Load top artists from local storage
    const artists = JSON.parse(localStorage.getItem('topArtists'));
    console.log("artists:", artists);
    if (artists) {
      setTopArtists(artists);
    }
  }, []);

  const handleLogin = () => {
    // Redirect to Spotify authorization URL
    window.location.href = '/api/spotify-auth';
  };

  return (
    <div>
      <h1>Artist Explorer</h1>
      <SpotifyLoginButton id="login-button" data-testid="login-button" onClick={handleLogin}>
        Log In
      </SpotifyLoginButton>
      <ArtistExplorerGraph topArtists={topArtists} />
    </div>
  );
}
