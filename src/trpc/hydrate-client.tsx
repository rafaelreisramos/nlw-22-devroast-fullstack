"use client";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { getQueryClient } from "./query-client";

export function HydrateClient({ children }: { children: ReactNode }) {
	const queryClient = getQueryClient();
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			{children}
		</HydrationBoundary>
	);
}
