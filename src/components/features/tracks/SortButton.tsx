import { Button } from "@/components/ui/button";
import {
    ChevronUp,
    ChevronDown,
    Calendar,
    Activity,
    Clock,
} from "lucide-react";
import { SortField, SortOrder } from "./TrackList"; // Adjust the import path as needed

interface SortButtonProps {
    field: SortField;
    sortField: SortField;
    sortOrder: SortOrder;
    toggleSort: (field: SortField) => void;
    children?: React.ReactNode;
    icon?: string;
    className?: string;
}

export const SortButton: React.FC<SortButtonProps> = ({
    field,
    sortField,
    sortOrder,
    toggleSort,
    children,
    icon,
    className,
}) => {
    const IconComponent =
        icon === "calendar"
            ? Calendar
            : icon === "activity"
            ? Activity
            : icon === "clock"
            ? Clock
            : null;

    return (
        <Button
            variant="ghost"
            size="sm"
            className={`h-8 flex items-center justify-center gap-1 px-2 w-full ${className}`}
            onClick={() => toggleSort(field)}
        >
            <div className="flex items-center gap-1">
                {IconComponent && <IconComponent className="w-4 h-4" />}
                {children}
            </div>
            {sortField === field && (
                <div className="ml-1">
                    {sortOrder === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </div>
            )}
        </Button>
    );
};
