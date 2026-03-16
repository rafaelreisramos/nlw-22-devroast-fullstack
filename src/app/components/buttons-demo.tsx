"use client";

import { Button } from "@/components/ui/button";

const buttonVariantsList = [
	{ variant: "default", label: "Default" },
	{ variant: "destructive", label: "Destructive" },
	{ variant: "outline", label: "Outline" },
	{ variant: "secondary", label: "Secondary" },
	{ variant: "ghost", label: "Ghost" },
	{ variant: "link", label: "Link" },
];

const buttonSizes = [
	{ size: "sm", label: "Small" },
	{ size: "default", label: "Default" },
	{ size: "lg", label: "Large" },
	{ size: "icon", label: "Icon" },
];

export function ButtonsDemo() {
	return (
		<div className="space-y-8">
			<div>
				<h3 className="mb-3 font-mono text-sm text-text-secondary">Variants</h3>
				<div className="flex flex-wrap gap-3">
					{buttonVariantsList.map((item) => (
						<Button key={item.variant} variant={item.variant as never}>
							{item.label}
						</Button>
					))}
				</div>
			</div>

			<div>
				<h3 className="mb-3 font-mono text-sm text-text-secondary">Sizes</h3>
				<div className="flex items-center gap-3">
					{buttonSizes.map((item) => (
						<Button key={item.size} size={item.size as never}>
							{item.size === "icon" ? "X" : item.label}
						</Button>
					))}
				</div>
			</div>

			<div>
				<h3 className="mb-3 font-mono text-sm text-text-secondary">
					With className override
				</h3>
				<div className="flex gap-3">
					<Button variant="default" className="w-48 justify-start">
						Full Width
					</Button>
					<Button variant="default" className="rounded-full">
						Rounded
					</Button>
				</div>
			</div>

			<div>
				<h3 className="mb-3 font-mono text-sm text-text-secondary">States</h3>
				<div className="flex gap-3">
					<Button variant="default" disabled>
						Disabled
					</Button>
					<Button variant="default" onClick={() => alert("clicked")}>
						Click me
					</Button>
				</div>
			</div>
		</div>
	);
}
