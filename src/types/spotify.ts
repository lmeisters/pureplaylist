export interface PlaylistTrack {
    track: {
        id: string;
        uri: string;
        name: string;
        artists: Array<{ name: string }>;
        album: {
            name: string;
            release_date: string;
            images: Array<{ url: string }>;
        };
        duration_ms: number;
    };
    // Add other properties as needed
}

export interface PlaylistTrackResponse {
    items: PlaylistTrack[];
    next: string | null;
    playlistDetails?: {
        owner: {
            id: string;
        };
    };
}

export interface Playlist {
  id: string;
  name: string;
  tracks: {
    total: number;
  };
  images: Array<{ url: string }>;
  createdAt?: Date | string | number;
}

export interface AudioFeatures {
    tempo: number;
    // Add other audio feature properties
}
