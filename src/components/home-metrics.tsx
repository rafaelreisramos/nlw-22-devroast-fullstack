"use client";

import NumberFlow from "@number-flow/react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function HomeMetrics() {
	const trpc = useTRPC();
	const { data } = useQuery(trpc.metrics.getHomeStats.queryOptions());

	return (
		<div className="flex items-center justify-center gap-6 py-4">
			<span className="font-mono text-xs text-text-tertiary">
				<NumberFlow
					value={data?.totalSubmissions ?? 0}
					format={{ useGrouping: true }}
					className="font-mono tabular-nums"
				/>{" "}
				codes roasted
			</span>
			<span className="font-mono text-xs text-text-tertiary">·</span>
			<span className="font-mono text-xs text-text-tertiary">
				avg score:{" "}
				<NumberFlow
					value={Number(data?.avgScore ?? 0)}
					format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
					className="font-mono tabular-nums"
				/>
			</span>
		</div>
	);
}
