"use client";

import { ALL_OPEN_CHORDS, displayLabel } from "@/lib/music/chords";
import type { ChordId } from "@/lib/music/types";
import { FretboardDiagramView } from "@/components/chord/FretboardDiagram";

type ManualChordPickerProps = {
	disabled?: boolean;
	onSelect: (chord: ChordId) => void;
};

export function ManualChordPicker({ disabled, onSelect }: ManualChordPickerProps) {
	return (
		<div>
			<p className="mb-3 text-sm text-[var(--ink-muted)]">
				Pick an open major or minor chord for the focused pin. Hover for the fretboard
				diagram.
			</p>
			<div
				className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8"
				aria-label="Open chords"
			>
				{ALL_OPEN_CHORDS.map((chord) => (
					<div key={chord} className="group relative">
						<button
							type="button"
							disabled={disabled}
							onClick={() => onSelect(chord)}
							aria-label={`Select ${displayLabel(chord)}`}
							className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-2 py-3 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] focus-visible:border-[var(--accent)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						>
							{displayLabel(chord)}
						</button>
						<div
							className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-20 hidden -translate-x-1/2 rounded-xl border border-[var(--line)] bg-white p-2 shadow-lg group-hover:block group-focus-within:block"
							role="tooltip"
						>
							<FretboardDiagramView chord={chord} />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
