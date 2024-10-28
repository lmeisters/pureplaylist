import { useState, useEffect, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

interface FilterTabProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: FilterCriteria) => void;
    onClearFilters: () => void;
    initialFilters: FilterCriteria;
}

export interface FilterCriteria {
    titleKeywords: string[];
    albums: string[];
    artists: string[];
}

export function FilterTab({
    isOpen,
    onClose,
    onApplyFilters,
    onClearFilters,
    initialFilters,
}: FilterTabProps) {
    const [titleKeywordInput, setTitleKeywordInput] = useState("");
    const [albumInput, setAlbumInput] = useState("");
    const [artistInput, setArtistInput] = useState("");

    useEffect(() => {
        setTitleKeywordInput(initialFilters.titleKeywords.join(", "));
        setAlbumInput(initialFilters.albums.join(", "));
        setArtistInput(initialFilters.artists.join(", "));
    }, [initialFilters, isOpen]);

    const handleApplyFilters = () => {
        const filters: FilterCriteria = {
            titleKeywords: titleKeywordInput
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean),
            albums: albumInput
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean),
            artists: artistInput
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean),
        };
        onApplyFilters(filters);
        onClose();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleApplyFilters();
        }
    };

    const handleClearFilters = () => {
        setTitleKeywordInput("");
        setAlbumInput("");
        setArtistInput("");
        onClearFilters();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Filter Tracks</DialogTitle>
                    <DialogDescription>
                        Enter keywords to filter your playlist tracks. You can
                        use any combination of title keywords, genres, and
                        artists.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div>
                        <label
                            htmlFor="titleKeywords"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Title Keywords
                        </label>
                        <Input
                            id="titleKeywords"
                            value={titleKeywordInput}
                            onChange={(e) =>
                                setTitleKeywordInput(e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="live, instrumental"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="albums"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Albums
                        </label>
                        <Input
                            id="albums"
                            value={albumInput}
                            onChange={(e) => setAlbumInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="The Dark Side of the Moon, Thriller"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="artists"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Artists
                        </label>
                        <Input
                            id="artists"
                            value={artistInput}
                            onChange={(e) => setArtistInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Armin Van Buuren, Metallica"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClearFilters}>
                        Clear Filters
                    </Button>
                    <Button onClick={handleApplyFilters}>Apply Filters</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
