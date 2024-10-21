import { useInfiniteQuery } from '@tanstack/react-query';
import { spotifyApi, setAccessToken } from '@/lib/spotify';
import { useSession } from 'next-auth/react';
import { FilterCriteria } from '@/components/FilterTab';

interface PlaylistTrackResponse {
  items: any[];
  next: string | null;
}

export const usePlaylistTracksQuery = (playlistId: string, filterCriteria: FilterCriteria) => {
  const { data: session } = useSession();

  return useInfiniteQuery<PlaylistTrackResponse, Error>({
    queryKey: ['playlistTracks', playlistId, filterCriteria],
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
          originalIndex: pageParam + index + 1 // Add originalIndex
        }));

        // Apply filtering
        const filteredItems = mergedItems.filter((item: any) => {
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

        return {
          ...tracksResponse.data,
          items: filteredItems
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
};
