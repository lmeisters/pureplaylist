/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "i.scdn.co",
            "image-cdn-fa.spotifycdn.com",
            // Add any other image domains you need
        ],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "image-cdn-fa.spotifycdn.com",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
