/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "openweathermap.org",
        pathname: "/img/wn/**",
      },
    ],
  },
};

module.exports = nextConfig;
