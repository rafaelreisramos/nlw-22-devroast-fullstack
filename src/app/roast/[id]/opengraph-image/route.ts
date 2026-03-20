import type { NextRequest } from "next/server";
import { generateOpenGraphImage } from "@/lib/takumi";
import { createCallerFactory } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";

export const dynamic = "force-dynamic";

const createCaller = createCallerFactory(appRouter);

interface SubmissionPreview {
	score: number;
	language: string;
	verdict: string;
	roastQuote: string;
	lineCount: number;
}

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;

	const caller = createCaller({});

	let submission: SubmissionPreview;
	try {
		submission = await caller.roast.getById({ id });
	} catch {
		return new Response("Submission not found", { status: 404 });
	}

	const response = await generateOpenGraphImage({
		score: submission.score,
		language: submission.language,
		verdict: submission.verdict,
		roastQuote: submission.roastQuote,
		lineCount: submission.lineCount,
	});

	response.headers.set("Cache-Control", "public, max-age=31536000, immutable");

	return response;
}
