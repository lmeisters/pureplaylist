"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface ErrorBoundaryProps {
    children: ReactNode;
}

function ErrorBoundary({ children }: ErrorBoundaryProps) {
    const [hasError, setHasError] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const errorHandler = (error: ErrorEvent) => {
            console.error("Uncaught error:", error);
            setHasError(true);
            toast({
                title: "An error occurred",
                description: "We're sorry, but something went wrong.",
                variant: "destructive",
            });
        };

        window.addEventListener("error", errorHandler);

        return () => {
            window.removeEventListener("error", errorHandler);
        };
    }, [toast]);

    if (hasError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold mb-4">
                    Something went wrong.
                </h1>
                <p className="text-lg mb-4">
                    We're sorry, but an error occurred while loading your
                    playlists.
                </p>
                <button
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    onClick={() => setHasError(false)}
                >
                    Try again
                </button>
            </div>
        );
    }

    return <>{children}</>;
}

export default ErrorBoundary;
