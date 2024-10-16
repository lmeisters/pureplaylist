import axios from 'axios';

const SPOTIFY_API = 'https://api.spotify.com/v1';

export const spotifyApi = axios.create({
  baseURL: SPOTIFY_API,
});

export const setAccessToken = (token: string) => {
  spotifyApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getUserPlaylists = async () => {
  const response = await spotifyApi.get('/me/playlists');
  return response.data;
};