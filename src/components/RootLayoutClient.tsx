"use client";

import AppHeader from "@/components/AppHeader";
import LandingHeader from "@/components/LandingHeader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { useSession } from "next-auth/react";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const isAuthenticated = status === "authenticated";

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {isAuthenticated ? <AppHeader /> : <LandingHeader />}
            <main className="flex-1 overflow-hidden">{children}</main>
            <Toaster />
        </div>
    );
}

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
            <QueryClientProvider client={queryClient}>
                <Layout>{children}</Layout>
            </QueryClientProvider>
        </Providers>
    );
}
