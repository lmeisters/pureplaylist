/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["i.scdn.co"],
        minimumCacheTTL: 60 * 60 * 24, // 24 hours
        dangerouslyAllowSVG: true,
        contentDispositionType: "attachment",
        contentSecurityPolicy:
            "default-src 'self'; script-src 'none'; sandbox;",
    },
};

export default nextConfig;
