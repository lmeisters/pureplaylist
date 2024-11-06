import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { spotifyApi, setAccessToken } from '@/lib/spotify';
import { useSession } from 'next-auth/react';
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from 'axios';
import { SpotifyPlaylist } from '@/types/spotify';
import { useEffect, useState } from 'react';

export const usePlaylistsQuery = () => {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [allPlaylists, setAllPlaylists] = useState<SpotifyPlaylist[]>([]);

  const query = useInfiniteQuery({
    queryKey: ['playlists'],
    queryFn: async ({ pageParam = 0 }): Promise<{ items: SpotifyPlaylist[], next: string | null }> => {
      if (session?.accessToken) {
        setAccessToken(session.accessToken as string);
        try {
          const response = await spotifyApi.get('/me/playlists', {
            params: {
              limit: 50, 
              offset: pageParam
            }
          });
          return {
            items: response.data.items,
            next: response.data.next
          };
        } catch (error) {
          if (error instanceof AxiosError && error.response?.status === 401) {
            await update();
            toast({
              title: "Session Refreshed",
              description: "Please try your action again.",
              variant: "default",
            });
            queryClient.invalidateQueries({ queryKey: ['playlists'] });
          }
          throw error;
        }
      }
      return { items: [], next: null };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        return Number(url.searchParams.get('offset'));
      }
      return undefined;
    },
    enabled: !!session?.accessToken,
    initialPageParam: 0,
  });

  // Combine all pages of playlists into a single array
  useEffect(() => {
    if (query.data) {
      const playlists = query.data.pages.flatMap(page => page.items);
      setAllPlaylists(playlists);
    }
  }, [query.data]);

  // Automatically fetch next page if available
  useEffect(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query.data, query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  return {
    ...query,
    data: allPlaylists, // Return the combined playlists instead of paginated data
  };
};
