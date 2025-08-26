import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
				pathname: "/v0/b/**", // ✅ match URL kiểu /v0/b/<bucket>/o/<file>...
			},
		],
	},
};

export default nextConfig;
