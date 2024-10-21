import { Button } from "@/components/ui/button";
import {
    ChevronUp,
    ChevronDown,
    Calendar,
    Activity,
    Clock,
} from "lucide-react";

interface SortButtonProps {
    field: string;
    sortField: string;
    sortOrder: "asc" | "desc";
    toggleSort: (field: string) => void;
    children?: React.ReactNode;
    icon?: "calendar" | "activity" | "clock";
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
            className={`h-8 flex items-center gap-1 ${className}`}
            onClick={() => toggleSort(field)}
        >
            {IconComponent && <IconComponent className="w-4 h-4" />}
            {children}
            {sortField === field &&
                (sortOrder === "asc" ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                ))}
        </Button>
    );
};
