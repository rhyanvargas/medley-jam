"use client";

import type { ProgressionMode } from "@/lib/progression/state";

type ModeToggleProps = {
	mode: ProgressionMode;
	disabled?: boolean;
	onChange: (mode: ProgressionMode) => void;
};

export function ModeToggle({ mode, disabled, onChange }: ModeToggleProps) {
	return (
		<div
			className="inline-flex rounded-full border border-[var(--line)] bg-[var(--surface)] p-1"
			role="group"
			aria-label="Input mode"
		>
			{(["manual", "listen"] as const).map((value) => {
				const active = mode === value;
				return (
					<button
						key={value}
						type="button"
						disabled={disabled}
						onClick={() => onChange(value)}
						className={[
							"rounded-full px-4 py-1.5 text-sm capitalize transition",
							active
								? "bg-[var(--ink)] text-[var(--paper)]"
								: "text-[var(--ink-muted)] hover:text-[var(--ink)]",
						].join(" ")}
						aria-pressed={active}
					>
						{value}
					</button>
				);
			})}
		</div>
	);
}
