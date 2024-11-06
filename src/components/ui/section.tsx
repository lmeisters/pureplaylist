import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    containerWidth?: "default" | "wide" | "full";
    variant?: "default" | "gray" | "dark" | "footer" | "hero";
    size?: "default" | "half";
    noPaddingTop?: boolean;
    allowOverflow?: boolean;
}

const SECTION_SIZES = {
    default: {
        height: "min-h-[400px] sm:min-h-[600px] lg:min-h-[800px]",
        padding: "pt-12 pb-12 sm:pt-32 sm:pb-32",
    },
    half: {
        height: "min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]",
        padding: "pt-12 pb-12 sm:pt-32 sm:pb-32",
    },
    footer: {
        height: "min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]",
        padding: "py-8 sm:py-12",
    },
} as const;

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
    const sizeConfig =
        variant === "footer" ? SECTION_SIZES.footer : SECTION_SIZES[size];

    return (
        <section
            className={cn(
                "relative flex flex-col items-center justify-center",
                "px-4 sm:px-8 lg:px-12",
                "w-full max-w-[2000px] mx-auto",
                !noPaddingTop && sizeConfig.padding,
                sizeConfig.height,
                "max-h-none",
                variant === "default" && "bg-background/50",
                variant === "gray" && "bg-[#F5F5F5]",
                variant === "dark" && "bg-black text-white",
                variant === "hero" && "bg-[#FAFAFA]",
                variant === "footer" &&
                    "min-h-[200px] sm:min-h-[250px] lg:min-h-[300px] max-h-none bg-black text-white py-8 sm:py-12",
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
                    "px-4 sm:px-6 lg:px-8",
                    allowOverflow && "overflow-visible"
                )}
            >
                {children}
            </div>
        </section>
    );
}
