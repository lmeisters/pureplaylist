import { useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { spotifyApi, setAccessToken } from '@/lib/spotify';
import { useSession } from 'next-auth/react';

interface PlaylistTrackResponse {
  items: any[];
  next: string | null;
}

export const usePlaylistTracksQuery = (playlistId: string) => {
  const { data: session } = useSession();

  return useInfiniteQuery<PlaylistTrackResponse, Error, PlaylistTrackResponse, string[], number>({
    queryKey: ['playlistTracks', playlistId],
    queryFn: async ({ pageParam = 0 }) => {
      if (session?.accessToken) {
        setAccessToken(session.accessToken as string);
        const response = await spotifyApi.get(`/playlists/${playlistId}/tracks`, {
          params: {
            offset: pageParam,
            limit: 50 // You can adjust this value
          }
        });
        return response.data;
      }
      return { items: [], next: null };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        return Number(url.searchParams.get('offset'));
      }
      return undefined;
    },
    enabled: !!session?.accessToken && !!playlistId,
  });
};
