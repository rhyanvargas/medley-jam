import type { ChordId } from "./types";

const ROOTS = [
	"C",
	"C#",
	"D",
	"D#",
	"E",
	"F",
	"F#",
	"G",
	"G#",
	"A",
	"A#",
	"B",
] as const;

/** All 24 open major/minor chord ids (12 roots × maj/min). */
export const ALL_OPEN_CHORDS: ChordId[] = ROOTS.flatMap((root) => [
	root as ChordId,
	`${root}m` as ChordId,
]);

/** Human-readable label; sharps use ♯. */
export function displayLabel(chord: ChordId): string {
	return chord.replace("#", "♯");
}
