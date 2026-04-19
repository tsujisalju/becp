import type { NextConfig } from "next";
import path from "path";

// Extract the Pinata gateway hostname from the env var (e.g. "mygateway.mypinata.cloud"
// or "https://mygateway.mypinata.cloud") so next/image can optimise IPFS images.
const pinataGatewayHostname = process.env.NEXT_PUBLIC_GATEWAY_URL
  ? process.env.NEXT_PUBLIC_GATEWAY_URL.replace(/^https?:\/\//, "").replace(/\/$/, "")
  : "*.mypinata.cloud";

const nextConfig: NextConfig = {
  transpilePackages: ["@becp/shared"],
  turbopack: {
    root: path.join(__dirname, ".."),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: pinataGatewayHostname,
      },
    ],
  },
};

export default nextConfig;
