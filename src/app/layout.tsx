import "./globals.css";
import { RootLayoutClient } from "@/components/RootLayoutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "PurePlaylist",
    description: "Organize and manage your Spotify playlists with ease",
    keywords: ["Spotify", "playlist", "music", "organization"],
    authors: [{ name: "Linards M." }],
    openGraph: {
        title: "PurePlaylist",
        description: "Organize and manage your Spotify playlists with ease",
        // url: "https://pureplaylist.com",
        siteName: "PurePlaylist",
        // images: [
        //     {
        //         url: "https://pureplaylist.com/og-image.jpg",
        //         width: 1200,
        //         height: 630,
        //     },
        // ],
        locale: "en_LV",
        type: "website",
    },
    // twitter: {
    //     card: "summary_large_image",
    //     title: "PurePlaylist",
    //     description: "Organize and manage your Spotify playlists with ease",
    //     images: ["https://pureplaylist.com/twitter-image.jpg"],
    // },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <RootLayoutClient>{children}</RootLayoutClient>
            </body>
        </html>
    );
}
