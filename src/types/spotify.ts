export interface PlaylistTrackResponse {
    items: SpotifyTrack[];
    next: string | null;
    total: number;
    playlistDetails?: {
        owner: {
            id: string;
        };
    };
}
export interface PlaylistDetails {
    owner: {
        id: string;
    };
}

export interface SpotifyTrack {
    track: {
        id: string;
        uri: string;
        name: string;
        artists: Array<{ name: string }>;
        album: {
            name: string;
            images: Array<{ url: string }>;
            release_date: string;
        };
        duration_ms: number;
    };
    originalIndex: number;
}

export interface AudioFeatures {
    id: string;
    tempo: number;
}

export interface SpotifyPlaylist {
    id: string;
    name: string;
    images: Array<{ url: string }>;
    tracks: {
        total: number;
    };
}
