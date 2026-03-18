import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	serverExternalPackages: ["pg", "pg-extra", "pg-connection-string", "pgpass"],
	transpilePackages: ["drizzle-orm"],
};

export default nextConfig;
