"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

export function ToggleDemo() {
	const [toggleOn, setToggleOn] = useState(false);

	return (
		<div className="flex items-center gap-12">
			<div className="flex items-center gap-3">
				<Toggle checked={toggleOn} onCheckedChange={setToggleOn} />
				<span className="font-mono text-sm text-accent-green">roast mode</span>
			</div>

			<div className="flex items-center gap-3">
				<Toggle checked={false} />
				<span className="font-mono text-sm text-text-secondary">
					roast mode (off)
				</span>
			</div>
		</div>
	);
}
