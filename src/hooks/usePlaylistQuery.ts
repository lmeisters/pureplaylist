import { useQuery } from '@tanstack/react-query';
import { spotifyApi, setAccessToken } from '@/lib/spotify';
import { useSession } from 'next-auth/react';

export const usePlaylistsQuery = () => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      if (session?.accessToken) {
        setAccessToken(session.accessToken as string);
        const response = await spotifyApi.get('/me/playlists');
        return response.data.items;
      }
      return [];
    },
    enabled: !!session?.accessToken,
  });
};