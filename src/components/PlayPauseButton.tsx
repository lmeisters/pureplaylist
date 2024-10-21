import React from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlayPauseButtonProps {
    track: any; // Replace 'any' with a more specific type if available
    // Add any other props you need
}

export const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({ track }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
        // Add logic to actually play/pause the track
    };

    return (
        <Button variant="ghost" size="icon" onClick={togglePlay}>
            {isPlaying ? (
                <Pause className="h-4 w-4" />
            ) : (
                <Play className="h-4 w-4" />
            )}
        </Button>
    );
};
