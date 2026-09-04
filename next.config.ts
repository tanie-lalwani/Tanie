import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/tanie-lalwani",
        permanent: false,
      },
      {
        source: "/instagram",
        destination: "https://instagram.com/tanie.mp3",
        permanent: false,
      },
      {
        source: "/linkedin",
        destination: "https://www.linkedin.com/in/tanie-lalwani/",
        permanent: false,
      },
      {
        source: "/x",
        destination: "https://x.com/tanielalwani",
        permanent: false,
      },
      {
        source: "/gdev",
        destination: "https://me.developers.google.com/u/tanielalwani",
        permanent: false,
      },
      {
        source: "/google",
        destination: "https://me.developers.google.com/u/tanielalwani",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
