import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Filter, Trash2 } from "lucide-react";
import { PlaylistDetails } from "@/types/spotify";

interface TrackListHeaderProps {
    isMultiSelectMode: boolean;
    toggleMultiSelectMode: () => void;
    selectedTracksCount: number;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    savePlaylist: (createNew: boolean) => Promise<void>;
    isSaving: boolean;
    filteredTracksCount: number;
    onClearFilters: () => void;
    onOpenFilterModal: () => void;
    deleteFilteredTracks: () => void;
    playlistName: string;
    onApplyFilters: (criteria: any) => void;
    deleteSelectedTracks: () => void;
    playlistDetails: PlaylistDetails | null;
}

export const TrackListHeader: React.FC<TrackListHeaderProps> = ({
    selectedTracksCount,
    setIsDialogOpen,
    savePlaylist,
    isSaving,
    filteredTracksCount,
    onClearFilters,
    onOpenFilterModal,
    deleteFilteredTracks,
    playlistName,
    deleteSelectedTracks,
}) => {
    return (
        <div className="p-4 font-semibold border-b flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
            <h2 className="text-xl font-bold truncate" title={playlistName}>
                {playlistName}
            </h2>
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={onOpenFilterModal}>
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                </Button>
                {filteredTracksCount > 0 && (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onClearFilters}
                        >
                            Clear Filters ({filteredTracksCount})
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={deleteFilteredTracks}
                        >
                            Delete Filtered
                        </Button>
                    </>
                )}
                {selectedTracksCount > 0 && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={deleteSelectedTracks}
                        className="flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Selected ({selectedTracksCount})
                    </Button>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDialogOpen(true)}
                >
                    Save as New
                </Button>
                <Button
                    variant="default"
                    size="sm"
                    onClick={() => savePlaylist(false)}
                    disabled={isSaving}
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Update"}
                </Button>
            </div>
        </div>
    );
};
