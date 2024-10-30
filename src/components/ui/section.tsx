import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    containerWidth?: "default" | "wide";
}

export function Section({
    children,
    className,
    containerWidth = "default",
    ...props
}: SectionProps) {
    return (
        <section
            className={cn(
                "flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-secondary px-4 sm:px-6 lg:px-8 mt-20",
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
