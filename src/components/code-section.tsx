"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/code-editor/CodeEditor";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

export function CodeSection() {
	const [code, setCode] = useState("");
	const isCodeValid = code.length > 0 && code.length <= 2000;

	return (
		<>
			<CodeEditor code={code} onCodeChange={setCode} showLanguageSelector />

			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2.5">
						<Toggle defaultChecked />
						<span className="font-mono text-sm text-accent-green">
							roast mode
						</span>
					</div>
					<span className="font-mono text-xs text-text-tertiary">
						{`// maximum sarcasm enabled`}
					</span>
				</div>
				<Button disabled={!isCodeValid}>$ roast_my_code</Button>
			</div>
		</>
	);
}
