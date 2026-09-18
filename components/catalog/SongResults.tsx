"use client";

import { displayLabel } from "@/lib/music/chords";
import type { Song } from "@/lib/catalog/port";

type SongResultsProps = {
	results: Song[];
	searched: boolean;
};

export function SongResults({ results, searched }: SongResultsProps) {
	if (!searched) return null;

	if (results.length === 0) {
		return (
			<div
				className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] px-5 py-8 text-center"
				role="status"
			>
				<p className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
					No exact matches
				</p>
				<p className="mt-2 text-sm text-[var(--ink-muted)]">
					No seeded songs use that exact four-chord sequence.
				</p>
			</div>
		);
	}

	return (
		<ul className="space-y-3" aria-label="Matching songs">
			{results.map((song) => (
				<li
					key={song.id}
					className="border-b border-[var(--line)] pb-3 last:border-b-0 last:pb-0"
				>
					<p className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
						{song.title}
					</p>
					<p className="text-sm text-[var(--ink-muted)]">{song.artist}</p>
					<p className="mt-1 text-sm tracking-wide text-[var(--ink)]">
						{song.progression.map(displayLabel).join(" · ")}
					</p>
				</li>
			))}
		</ul>
	);
}
