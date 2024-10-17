import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface SavePlaylistDialogProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    newPlaylistName: string;
    setNewPlaylistName: (value: string) => void;
    savePlaylist: (createNew: boolean) => void;
    isSaving: boolean;
}

export const SavePlaylistDialog: React.FC<SavePlaylistDialogProps> = ({
    isOpen,
    setIsOpen,
    newPlaylistName,
    setNewPlaylistName,
    savePlaylist,
    isSaving,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Playlist</DialogTitle>
                    <DialogDescription>
                        Enter a name for your new playlist. This will create a
                        new playlist with the current track order.
                    </DialogDescription>
                </DialogHeader>
                <Input
                    placeholder="Enter new playlist name"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                />
                <Button onClick={() => savePlaylist(true)} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Create and Save"}
                </Button>
            </DialogContent>
        </Dialog>
    );
};
