/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.weatherapi.com",
        port: "", // Leave empty unless a specific port is required
        pathname: "/weather/**", // Match the path of the weather icons
      },
    ],
  },
};

module.exports = nextConfig;