export interface PlaylistTrackResponse {
    items: any[]; // Replace 'any' with a more specific type if available
    next: string | null;
    playlistDetails?: {
        owner: {
            id: string;
        };
    };
}
