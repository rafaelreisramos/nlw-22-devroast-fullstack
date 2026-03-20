"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { SupportedLanguage } from "@/lib/ai/types";
import { useTRPC } from "@/trpc/client";

export function useRoastSubmit() {
	const router = useRouter();
	const trpc = useTRPC();

	const mutation = useMutation(
		trpc.roast.submit.mutationOptions({
			onSuccess: (data) => {
				router.push(`/roast/${data.id}`);
			},
		}),
	);

	return {
		submit: (code: string, language: SupportedLanguage, roastMode: boolean) =>
			mutation.mutateAsync({ code, language, roastMode }),
		isPending: mutation.isPending,
		error: mutation.error,
	};
}
