import NextAuth, { DefaultSession } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

// Extend the Session type
declare module "next-auth" {
    interface Session extends DefaultSession {
        accessToken?: string;
    }
}

const handler = NextAuth({
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID!,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "user-read-email playlist-read-private user-library-read",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            return session;
        },
    },
});

export { handler as GET, handler as POST };
