export interface PlaylistTrackResponse {
    items: any[]; // Replace 'any' with a more specific type if available
    next: string | null;
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
    uri: string;
    name: string;
    artists: Array<{ name: string }>;
    album: {
        name: string;
        images: Array<{ url: string }>;
        release_date: string;
    };
    duration_ms: number;
}

export interface AudioFeatures {
    tempo: number;
    // Add other audio features as needed
}
