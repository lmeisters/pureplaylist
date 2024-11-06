import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { spotifyApi, setAccessToken } from '@/lib/spotify';
import { useSession } from 'next-auth/react';
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from 'axios';
import { SpotifyPlaylist } from '@/types/spotify';
import { useEffect, useState, useCallback } from 'react';

export const usePlaylistsQuery = () => {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [allPlaylists, setAllPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const query = useInfiniteQuery({
    queryKey: ['playlists'],
    queryFn: async ({ pageParam = 0 }): Promise<{ items: SpotifyPlaylist[], next: string | null, total: number }> => {
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
            next: response.data.next,
            total: response.data.total
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
      return { items: [], next: null, total: 0 };
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((count, page) => count + page.items.length, 0);
      if (lastPage.next && loadedCount < lastPage.total) {
        const url = new URL(lastPage.next);
        return Number(url.searchParams.get('offset'));
      }
      return undefined;
    },
    enabled: !!session?.accessToken,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep cache for 30 minutes
  });

  const updatePlaylists = useCallback(() => {
    if (query.data) {
      const uniquePlaylists = Array.from(
        new Map(
          query.data.pages.flatMap(page => 
            page.items.map(playlist => [playlist.id, playlist])
          )
        ).values()
      );
      setAllPlaylists(uniquePlaylists);
      
      // After first successful load, set initialLoad to false
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  }, [query.data, isInitialLoad]);

  useEffect(() => {
    updatePlaylists();
  }, [updatePlaylists]);

  useEffect(() => {
    const loadNextPage = async () => {
      if (query.hasNextPage && !query.isFetchingNextPage) {
        await query.fetchNextPage();
      }
    };
    loadNextPage();
  }, [query.data, query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  return {
    ...query,
    data: allPlaylists,
    isLoading: isInitialLoad && (query.isLoading || query.isFetchingNextPage),
  };
};
