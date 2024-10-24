import NextAuth, { NextAuthOptions, Session } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { JWT } from "next-auth/jwt";

const authOptions: NextAuthOptions = {
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID as string,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
            authorization: {
                params: {
                    scope: "user-read-email playlist-read-private playlist-modify-private playlist-modify-public",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            if (account && user) {
                return {
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    accessTokenExpires: account.expires_at
                        ? account.expires_at * 1000
                        : 0,
                    user,
                };
            }
            return token;
        },
        async session({ session, token }) {
            (session as Session).accessToken = token.accessToken as string;
            (session as Session).error = token.error as string | undefined;
            (session as Session).user = token.user as Session["user"];
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
