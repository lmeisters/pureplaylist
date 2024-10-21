import { useQuery, useQueryClient } from '@tanstack/react-query';
import { spotifyApi, setAccessToken } from '@/lib/spotify';
import { useSession } from 'next-auth/react';
import { useToast } from "@/hooks/use-toast";

export const usePlaylistsQuery = () => {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      if (session?.accessToken) {
        setAccessToken(session.accessToken as string);
        try {
          const response = await spotifyApi.get('/me/playlists');
          return response.data.items;
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            // Token might be expired, try to refresh the session
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
      return [];
    },
    enabled: !!session?.accessToken,
    retry: 1,
  });
};
