"server-only";

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createCallerFactory, createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
	ctx: createTRPCContext,
	router: appRouter,
	queryClient: getQueryClient,
});

import type { FetchQueryOptions } from "@tanstack/react-query";

export function prefetch<
	TQueryFnData,
	TError,
	TData,
	TQueryKey extends readonly unknown[],
>(queryOptions: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(queryOptions);
}

export const caller = createCallerFactory(appRouter)(createTRPCContext);
