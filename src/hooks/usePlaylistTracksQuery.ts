import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { spotifyApi, setAccessToken } from '@/lib/spotify';
import { useSession } from 'next-auth/react';
import { FilterCriteria } from '@/components/FilterTab';
import { useEffect, useState, useMemo } from 'react';

interface PlaylistTrackResponse {
  items: any[];
  next: string | null;
  total?: number;
}

export const usePlaylistTracksQuery = (playlistId: string, filterCriteria: FilterCriteria) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [allTracks, setAllTracks] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const query = useInfiniteQuery<PlaylistTrackResponse, Error>({
    queryKey: ['playlistTracks', playlistId],
    queryFn: async ({ pageParam = 0 }) => {
      if (session?.accessToken) {
        setAccessToken(session.accessToken as string);
        const tracksResponse = await spotifyApi.get(`/playlists/${playlistId}/tracks`, {
          params: {
            offset: pageParam,
            limit: 50
          }
        });

        const trackIds = tracksResponse.data.items.map((item: any) => item.track.id).join(',');
        const audioFeaturesResponse = await spotifyApi.get(`/audio-features?ids=${trackIds}`);

        const mergedItems = tracksResponse.data.items.map((item: any, index: number) => ({
          ...item,
          audioFeatures: audioFeaturesResponse.data.audio_features[index],
          originalIndex: (pageParam as number) + index + 1
        }));

        return {
          ...tracksResponse.data,
          items: mergedItems
        };
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
    enabled: !!session?.accessToken && !!playlistId,
    initialPageParam: 0,
  });

  // Load more tracks in the background
  useEffect(() => {
    const loadMoreTracks = async () => {
      if (query.hasNextPage && !isLoadingMore) {
        setIsLoadingMore(true);
        await query.fetchNextPage();
        setIsLoadingMore(false);
      }
    };

    loadMoreTracks();
  }, [query.data, query.hasNextPage, isLoadingMore]);

  // Update allTracks and loadingProgress when new data is fetched
  useEffect(() => {
    if (query.data) {
      const newTracks = query.data.pages.flatMap(page => page.items);
      setAllTracks(newTracks);
      
      const totalTracks = query.data.pages[0].total || 0;
      const loadedTracks = newTracks.length;
      const progress = totalTracks > 0 ? (loadedTracks / totalTracks) * 100 : 0;
      setLoadingProgress(Math.min(progress, 100));
    }
  }, [query.data]);

  // Apply client-side filtering
  const filteredTracks = useMemo(() => {
    if (filterCriteria.titleKeywords.length === 0 && 
        filterCriteria.genres.length === 0 && 
        filterCriteria.artists.length === 0) {
      return [];
    }

    return allTracks.filter((item: any) => {
      const title = item.track.name.toLowerCase();
      const artist = item.track.artists.map((a: any) => a.name.toLowerCase()).join(" ");
      const genre = item.track.album.genres ? item.track.album.genres.join(" ").toLowerCase() : "";

      const matchesTitle = filterCriteria.titleKeywords.length === 0 || 
        filterCriteria.titleKeywords.some((keyword: string) => title.includes(keyword.toLowerCase()));
      const matchesGenre = filterCriteria.genres.length === 0 || 
        filterCriteria.genres.some((g: string) => genre.includes(g.toLowerCase()));
      const matchesArtist = filterCriteria.artists.length === 0 || 
        filterCriteria.artists.some((a: string) => artist.includes(a.toLowerCase()));

      return matchesTitle && matchesGenre && matchesArtist;
    });
  }, [allTracks, filterCriteria]);

  return {
    ...query,
    allTracks,
    filteredTracks,
    isLoadingMore,
    loadingProgress
  };
};
