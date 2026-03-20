import { ImageResponse } from "@takumi-rs/image-response";
import { OpenGraphImageTemplate } from "@/app/roast/[id]/opengraph-image/template";

type OpenGraphData = {
	score: number;
	language: string;
	verdict: string;
	roastQuote: string;
	lineCount: number;
};

export async function generateOpenGraphImage(data: OpenGraphData) {
	const response = new ImageResponse(OpenGraphImageTemplate(data), {
		width: 1200,
		height: 630,
	});

	return response;
}
