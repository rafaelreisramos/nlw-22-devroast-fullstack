import { Switch } from "@base-ui/react/switch";
import { twMerge } from "tailwind-merge";

export interface ToggleProps {
	checked?: boolean;
	defaultChecked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
}

export function Toggle({
	checked,
	defaultChecked,
	onCheckedChange,
	disabled,
	className,
}: ToggleProps) {
	return (
		<Switch.Root
			checked={checked}
			defaultChecked={defaultChecked}
			onCheckedChange={onCheckedChange}
			disabled={disabled}
			className={twMerge(
				"relative inline-flex h-[22px] w-10 items-center rounded-[11px] p-[3px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-checked:bg-accent-green data-unchecked:bg-border-primary",
				className,
			)}
		>
			<Switch.Thumb className="pointer-events-none block h-4 w-4 rounded-full bg-text-primary shadow-sm transition-transform data-checked:translate-x-4.5 data-unchecked:translate-x-0" />
		</Switch.Root>
	);
}
