import { useInfiniteQuery } from '@tanstack/react-query';
import { spotifyApi, setAccessToken } from '@/lib/spotify';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useMemo } from 'react';
import { SpotifyTrack, AudioFeatures as ImportedAudioFeatures, PlaylistTrackResponse } from '@/types/spotify';

interface AudioFeatures extends ImportedAudioFeatures {
  id: string;
}

export interface FilterCriteria {
  titleKeywords: string[];
  albums: string[];
  artists: string[];
}

export const usePlaylistTracksQuery = (playlistId: string, filterCriteria: FilterCriteria) => {
  const { data: session } = useSession();
  const [allTracks, setAllTracks] = useState<SpotifyTrack[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [audioFeatures, setAudioFeatures] = useState<Record<string, AudioFeatures>>({});
  const [playlistDetails, setPlaylistDetails] = useState<PlaylistTrackResponse['playlistDetails'] | null>(null);

  const fetchAudioFeatures = async (trackIds: string[]) => {
    const batchIds = trackIds.join(',');
    const response = await spotifyApi.get(`/audio-features?ids=${batchIds}`);
    const newAudioFeatures = response.data.audio_features.reduce((acc: Record<string, AudioFeatures>, feature: AudioFeatures) => {
      if (feature) {
        acc[feature.id] = feature;
      }
      return acc;
    }, {});
    setAudioFeatures(prev => ({ ...prev, ...newAudioFeatures }));
  };

  const query = useInfiniteQuery<PlaylistTrackResponse, Error>({
    queryKey: ['playlistTracks', playlistId],
    queryFn: async ({ pageParam = 0 }) => {
      if (session?.accessToken) {
        setAccessToken(session.accessToken as string);
        const [tracksResponse, playlistDetailsResponse] = await Promise.all([
          spotifyApi.get(`/playlists/${playlistId}/tracks`, {
            params: {
              offset: pageParam,
              limit: 100
            }
          }),
          spotifyApi.get(`/playlists/${playlistId}`)
        ]);

        const mergedItems = tracksResponse.data.items.map((item: any, index: number) => ({
          track: item.track,
          originalIndex: (pageParam as number) + index + 1
        }));

        return {
          items: mergedItems,
          next: tracksResponse.data.next,
          total: tracksResponse.data.total,
          playlistDetails: playlistDetailsResponse.data
        };
      }
      return { items: [], next: null, total: 0, playlistDetails: null };
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
      
      const totalTracks = query.data.pages[0].total;
      const loadedTracks = newTracks.length;
      const progress = totalTracks > 0 ? (loadedTracks / totalTracks) * 100 : 0;
      setLoadingProgress(Math.min(progress, 100));
    }
  }, [query.data]);

  // Apply client-side filtering
  const filteredTracks = useMemo(() => {
    if (filterCriteria.titleKeywords.length === 0 && 
        filterCriteria.albums.length === 0 && 
        filterCriteria.artists.length === 0) {
      return [];
    }

    return allTracks.filter((item: SpotifyTrack) => {
      const title = item.track.name.toLowerCase();
      const artist = item.track.artists.map((a) => a.name.toLowerCase()).join(" ");
      const album = item.track.album.name.toLowerCase();

      const matchesTitle = filterCriteria.titleKeywords.length === 0 || 
        filterCriteria.titleKeywords.some((keyword: string) => title.includes(keyword.toLowerCase()));
      const matchesAlbum = filterCriteria.albums.length === 0 || 
        filterCriteria.albums.some((a: string) => album.includes(a.toLowerCase()));
      const matchesArtist = filterCriteria.artists.length === 0 || 
        filterCriteria.artists.some((a: string) => artist.includes(a.toLowerCase()));

      return matchesTitle && matchesAlbum && matchesArtist;
    });
  }, [allTracks, filterCriteria]);

  useEffect(() => {
    setPlaylistDetails(query.data?.pages[0]?.playlistDetails ?? null);
  }, [query.data]);

  return {
    ...query,
    allTracks,
    filteredTracks,
    isLoadingMore,
    loadingProgress,
    audioFeatures,
    fetchAudioFeatures,
    playlistDetails
  };
};
