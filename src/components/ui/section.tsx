import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    containerWidth?: "default" | "wide" | "full";
    variant?: "default" | "gray" | "dark" | "footer";
    size?: "default" | "half";
    noPaddingTop?: boolean;
    allowOverflow?: boolean;
}

export function Section({
    children,
    className,
    containerWidth = "default",
    variant = "default",
    size = "default",
    noPaddingTop = false,
    allowOverflow = false,
    ...props
}: SectionProps) {
    return (
        <section
            className={cn(
                "relative flex flex-col items-center justify-center",
                "px-8 lg:px-16",
                !noPaddingTop && "pt-28 pb-28",
                size === "default" ? "min-h-screen" : "min-h-[50vh]",
                variant === "default" && "bg-background/50",
                variant === "gray" && "bg-secondary/30",
                variant === "dark" && "bg-black text-white",
                variant === "footer" && "min-h-[35vh] bg-black text-white",
                allowOverflow && "overflow-visible",
                className
            )}
            {...props}
        >
            <div
                className={cn(
                    "relative w-full mx-auto",
                    containerWidth === "default" && "max-w-4xl",
                    containerWidth === "wide" && "max-w-6xl",
                    containerWidth === "full" && "max-w-[1920px]",
                    allowOverflow && "overflow-visible"
                )}
            >
                {children}
            </div>
        </section>
    );
}
