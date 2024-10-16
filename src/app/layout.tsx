"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//     title: "PurePlaylist",
//     description: "Filter and search through your Spotify playlists",
// };

const queryClient = new QueryClient();

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <QueryClientProvider client={queryClient}>
                        <div className="min-h-screen bg-gray-100">
                            <Header />
                            <main>
                                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                                    {children}
                                </div>
                            </main>
                        </div>
                    </QueryClientProvider>
                </Providers>
            </body>
        </html>
    );
}
