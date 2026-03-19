import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	serverExternalPackages: ["pg", "pg-extra", "pg-connection-string", "pgpass"],
	transpilePackages: ["drizzle-orm"],
};

export default nextConfig;
