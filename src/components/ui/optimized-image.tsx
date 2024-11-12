import Image from "next/image";
import { useState, useEffect } from "react";

interface OptimizedImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
}

export function OptimizedImage({
    src,
    alt,
    width,
    height,
    className,
}: OptimizedImageProps) {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setImageSrc(src);
    }, [src]);

    return (
        <Image
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            className={`transition-opacity duration-200 ${
                isLoaded ? "opacity-100" : "opacity-0"
            } ${className}`}
            onLoad={() => setIsLoaded(true)}
            unoptimized
            loading="eager"
        />
    );
}
