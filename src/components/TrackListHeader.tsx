import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Trash2, Save } from "lucide-react";

interface TrackListHeaderProps {
    isMultiSelectMode: boolean;
    setIsMultiSelectMode: (value: boolean) => void;
    selectedTracks: Set<string>;
    deleteSelectedTracks: () => void;
    setIsDialogOpen: (value: boolean) => void;
    savePlaylist: (createNew: boolean) => void;
    isSaving: boolean;
}

export const TrackListHeader: React.FC<TrackListHeaderProps> = ({
    isMultiSelectMode,
    setIsMultiSelectMode,
    selectedTracks,
    deleteSelectedTracks,
    setIsDialogOpen,
    savePlaylist,
    isSaving,
}) => {
    return (
        <div className="p-4 font-semibold border-b flex justify-between items-center">
            <span>Playlist Tracks</span>
            <div className="space-x-2 flex items-center">
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={isMultiSelectMode}
                        onCheckedChange={setIsMultiSelectMode}
                    />
                    <span>Multi-select</span>
                </div>
                {isMultiSelectMode && selectedTracks.size > 0 && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Selected ({selectedTracks.size})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will remove {selectedTracks.size}{" "}
                                    selected track(s) from the playlist.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={deleteSelectedTracks}
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDialogOpen(true)}
                >
                    Save as New Playlist
                </Button>
                <Button
                    variant="default"
                    size="sm"
                    onClick={() => savePlaylist(false)}
                    disabled={isSaving}
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Update Current Playlist"}
                </Button>
            </div>
        </div>
    );
};
