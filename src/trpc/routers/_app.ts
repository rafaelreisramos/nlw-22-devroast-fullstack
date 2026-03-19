import { sql } from "drizzle-orm";
import { db } from "@/db";
import { getShameLeaderboard, getTotalRoastsCount } from "@/db/queries";
import { submissions } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
	metrics: createTRPCRouter({
		getHomeStats: baseProcedure.query(async () => {
			const result = await db
				.select({
					totalSubmissions: sql<number>`count(*)`,
					avgScore: sql<number>`coalesce(avg(${submissions.score}), 0)::numeric(10,1)`,
				})
				.from(submissions);

			return {
				totalSubmissions: result[0]?.totalSubmissions ?? 0,
				avgScore: result[0]?.avgScore ?? 0,
			};
		}),
	}),
	shameLeaderboard: createTRPCRouter({
		getItems: baseProcedure.query(async () => {
			return getShameLeaderboard(3);
		}),
		getTotalCount: baseProcedure.query(async () => {
			return getTotalRoastsCount();
		}),
	}),
});

export type AppRouter = typeof appRouter;
