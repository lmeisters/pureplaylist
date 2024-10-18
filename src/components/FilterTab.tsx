import { useState, useEffect, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
    genres: string[];
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
    const [genreInput, setGenreInput] = useState("");
    const [artistInput, setArtistInput] = useState("");

    useEffect(() => {
        setTitleKeywordInput(initialFilters.titleKeywords.join(", "));
        setGenreInput(initialFilters.genres.join(", "));
        setArtistInput(initialFilters.artists.join(", "));
    }, [initialFilters, isOpen]);

    const handleApplyFilters = () => {
        const filters: FilterCriteria = {
            titleKeywords: titleKeywordInput
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean),
            genres: genreInput
                .split(",")
                .map((g) => g.trim())
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
        setGenreInput("");
        setArtistInput("");
        onClearFilters();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Filter Tracks</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <label
                            htmlFor="titleKeywords"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Title Keywords (comma-separated)
                        </label>
                        <Input
                            id="titleKeywords"
                            value={titleKeywordInput}
                            onChange={(e) =>
                                setTitleKeywordInput(e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="e.g., live, instrumental"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="genres"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Genres (comma-separated)
                        </label>
                        <Input
                            id="genres"
                            value={genreInput}
                            onChange={(e) => setGenreInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g., trance, metal"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="artists"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Artists (comma-separated)
                        </label>
                        <Input
                            id="artists"
                            value={artistInput}
                            onChange={(e) => setArtistInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g., Armin Van Buuren, Metallica"
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
