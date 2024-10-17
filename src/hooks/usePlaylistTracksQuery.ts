import { useInfiniteQuery } from '@tanstack/react-query';
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
        const tracksResponse = await spotifyApi.get(`/playlists/${playlistId}/tracks`, {
          params: {
            offset: pageParam,
            limit: 50 // Amount of tracks to fetch per page
          }
        });

        // Fetch audio features for the tracks
        const trackIds = tracksResponse.data.items.map((item: any) => item.track.id).join(',');
        const audioFeaturesResponse = await spotifyApi.get(`/audio-features?ids=${trackIds}`);

        // Merge track data with audio features
        const mergedItems = tracksResponse.data.items.map((item: any, index: number) => ({
          ...item,
          audioFeatures: audioFeaturesResponse.data.audio_features[index]
        }));

        return {
          ...tracksResponse.data,
          items: mergedItems
        };
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
