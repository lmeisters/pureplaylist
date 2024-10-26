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
    // Add other properties as needed
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
    // Add other audio features as needed
}

export interface SpotifyPlaylist {
    id: string;
    name: string;
    images: Array<{ url: string }>;
    tracks: {
        total: number;
    };
    // Add any other properties that you need from the Spotify API playlist object
}
