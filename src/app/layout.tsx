import type { Metadata } from "next";
import Link from "next/link";
import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";

export const metadata: Metadata = {
	title: "DevRoast - Brutally Honest Code Reviews",
	description:
		"Drop your code below and we'll rate it — brutally honest or full roast mode",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased">
				<nav className="flex h-14 items-center justify-between border-b border-border-primary bg-bg-page px-10">
					<Link href="/" className="flex items-center gap-2">
						<span className="font-mono text-xl font-bold text-accent-green">
							&gt;
						</span>
						<span className="font-mono text-lg font-medium text-text-primary">
							devroast
						</span>
					</Link>
					<div className="flex items-center gap-6">
						<Link
							href="/leaderboard"
							className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors"
						>
							leaderboard
						</Link>
					</div>
				</nav>
				<TRPCReactProvider>{children}</TRPCReactProvider>
			</body>
		</html>
	);
}
