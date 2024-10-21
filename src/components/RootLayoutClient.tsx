"use client";

import Header from "@/components/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
            <QueryClientProvider client={queryClient}>
                <div className="flex flex-col h-screen overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-hidden">{children}</main>
                    <Toaster />
                </div>
            </QueryClientProvider>
        </Providers>
    );
}
