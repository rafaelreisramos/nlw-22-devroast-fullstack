"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/code-editor/CodeEditor";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useRoastSubmit } from "@/hooks/useRoastSubmit";
import type { SupportedLanguage } from "@/lib/ai/types";

export function CodeSection() {
	const [code, setCode] = useState("");
	const [language, setLanguage] = useState<SupportedLanguage>("javascript");
	const [roastMode, setRoastMode] = useState(true);
	const { submit, isPending } = useRoastSubmit();

	const isCodeValid = code.length > 0 && code.length <= 2000;

	const handleSubmit = () => {
		if (isCodeValid) {
			submit(code, language, roastMode);
		}
	};

	return (
		<>
			<CodeEditor
				code={code}
				language={language}
				onCodeChange={setCode}
				onLanguageChange={setLanguage}
				showLanguageSelector
			/>

			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2.5">
						<Toggle checked={roastMode} onCheckedChange={setRoastMode} />
						<span className="font-mono text-sm text-accent-green">
							roast mode
						</span>
					</div>
					<span className="font-mono text-xs text-text-tertiary">
						{roastMode
							? "// maximum sarcasm enabled"
							: "// professional analysis"}
					</span>
				</div>
				<Button disabled={!isCodeValid || isPending} onClick={handleSubmit}>
					{isPending ? "$ roasting..." : "$ roast_my_code"}
				</Button>
			</div>
		</>
	);
}
