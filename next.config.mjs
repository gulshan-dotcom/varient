/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ufs.sh",
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "**.uploadthing.com",
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.etsystatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.berettaaustralia.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.berettaaustralia.com.au",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "otcimages.basnop.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "4.imimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "rukminim1.flixcart.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "rukminim2.flixcart.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.etsystatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tse1.mm.bing.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "repository-images.githubusercontent.com",
        pathname: "/**",
      },
      
      {
        protocol: "https",
        hostname: "tse3.mm.bing.net",
        pathname: "/**",
      },
      
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**",
      },
      // {
      //   protocol: "https",
      //   hostname: "googleusercontent",
      //   pathname: "/**",
      // },
    ],
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" }, // Or use specific origin like http://localhost:8081
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
