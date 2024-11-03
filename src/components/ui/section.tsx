import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    containerWidth?: "default" | "wide";
    variant?: "default" | "gray" | "dark" | "footer";
    size?: "default" | "half";
    noPaddingTop?: boolean;
}

export function Section({
    children,
    className,
    containerWidth = "default",
    variant = "default",
    size = "default",
    noPaddingTop = false,
    ...props
}: SectionProps) {
    return (
        <section
            className={cn(
                "flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8",
                !noPaddingTop && "pt-20",
                size === "default" ? "min-h-screen" : "min-h-[50vh]",
                variant === "default" && "bg-background/50",
                variant === "gray" && "bg-secondary/50",
                variant === "dark" && "bg-black text-white",
                variant === "footer" && "min-h-[35vh] bg-black text-white",
                className
            )}
            {...props}
        >
            <div
                className={cn(
                    "mx-auto w-full",
                    containerWidth === "default" ? "max-w-4xl" : "max-w-6xl"
                )}
            >
                {children}
            </div>
        </section>
    );
}
