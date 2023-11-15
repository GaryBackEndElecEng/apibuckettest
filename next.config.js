/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "mdx", "tsx", "ts", "md"],
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
    swcPlugins: [
      [
        "next-superjson-plugin",
        {
          excluded: [],
        },
      ],
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value:
              "newmasterconnect.herokuapp.com,www.masterconnect.ca,ww.master-connect.ca,www.garymasterconnect.com,cdn.jsdelivr.net,compute-1.amazonaws.com,master-sale.herokuapp.com,awsprismabucket105646-dev.s3.amazonaws.com",
          },

          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version,XSRF-TOKEN,Access-Control-Allow-Origin",
          },
        ],
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "new-master.s3.ca-central-1.amazonaws.com",
        port: "",
        // pathname: '/account123/**',
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        // pathname: '/account123/**',
      },
      {
        protocol: "https",
        hostname: "masterultils.com",
        port: "",
        // pathname: '/account123/**',
      },
      {
        protocol: "https",
        hostname: "aws.amazon.com",
        port: "",
        // pathname: '/account123/**',
      },
      {
        protocol: "https",
        hostname: "amazon.com",
        port: "",
        // pathname: '/account123/**',
      },
    ],
  },
};

module.exports = nextConfig;
