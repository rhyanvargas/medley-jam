"use client";

import { displayLabel } from "@/lib/music/chords";
import type { ChordId } from "@/lib/music/types";

type ChordSlotsProps = {
	slots: (ChordId | null)[];
	focusIndex: number;
	locked: boolean;
	listening: boolean;
	onFocus: (index: number) => void;
	onClear: (index: number) => void;
};

export function ChordSlots({
	slots,
	focusIndex,
	locked,
	listening,
	onFocus,
	onClear,
}: ChordSlotsProps) {
	return (
		<ol className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Chord progression">
			{slots.map((chord, index) => {
				const focused = focusIndex === index;
				const isListening = listening && focused && !locked;
				return (
					<li key={index} className="group relative">
						<button
							type="button"
							disabled={locked}
							onClick={() => onFocus(index)}
							className={[
								"flex h-24 w-full flex-col items-center justify-center rounded-2xl border-2 transition",
								focused
									? "border-[var(--accent)] bg-[var(--accent-soft)]"
									: "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--ink-muted)]",
								locked ? "cursor-default opacity-90" : "cursor-pointer",
							].join(" ")}
							aria-pressed={focused}
							aria-label={
								chord
									? `Slot ${index + 1}: ${displayLabel(chord)}`
									: `Slot ${index + 1}: empty`
							}
						>
							<span className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[var(--ink-muted)]">
								{isListening ? "Listening" : `Chord ${index + 1}`}
							</span>
							<span className="mt-1 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)]">
								{chord ? displayLabel(chord) : "—"}
							</span>
						</button>
						{chord && !locked ? (
							<button
								type="button"
								onClick={() => onClear(index)}
								aria-label={`Clear slot ${index + 1}`}
								className="absolute right-2 top-2 rounded px-1.5 py-0.5 text-xs text-[var(--ink-muted)] opacity-0 transition hover:text-[var(--ink)] group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
							>
								Clear
							</button>
						) : null}
					</li>
				);
			})}
		</ol>
	);
}
