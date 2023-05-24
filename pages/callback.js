import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Extract the topArtists data from the URL hash
    const hash = window.location.hash.substring(1);
    const topArtists = JSON.parse(atob(hash));

    console.log("top artists during callback", topArtists);

    // Save the topArtists data to local storage
    localStorage.setItem('topArtists', JSON.stringify(topArtists));

    // Redirect the user to the home page
    router.push('/');
  }, []);

  return null; // Render nothing while we handle the redirect
}
