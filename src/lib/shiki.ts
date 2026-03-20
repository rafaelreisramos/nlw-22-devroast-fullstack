import { unstable_cache } from "next/cache";
import { codeToHtml } from "shiki";

export const cachedCodeToHtml = unstable_cache(
	async (code: string, lang: string): Promise<string> => {
		return codeToHtml(code, {
			lang,
			theme: "vesper",
		});
	},
	["code-to-html"],
	{ revalidate: 3600 },
);
