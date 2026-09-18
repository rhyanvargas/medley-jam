import type { ChordId } from "./types";

/** Low E → high e. `0` = open, `"x"` = muted, number = fret. */
export type FretboardDiagram = {
	strings: (number | "x")[];
};

export const CHORD_DIAGRAMS: Record<ChordId, FretboardDiagram> = {
	C: { strings: ["x", 3, 2, 0, 1, 0] },
	Cm: { strings: ["x", 3, 5, 5, 4, 3] },
	"C#": { strings: ["x", 4, 3, 1, 2, 1] },
	"C#m": { strings: ["x", 4, 6, 6, 5, 4] },
	D: { strings: ["x", "x", 0, 2, 3, 2] },
	Dm: { strings: ["x", "x", 0, 2, 3, 1] },
	"D#": { strings: ["x", "x", 1, 3, 4, 3] },
	"D#m": { strings: ["x", "x", 1, 3, 4, 2] },
	E: { strings: [0, 2, 2, 1, 0, 0] },
	Em: { strings: [0, 2, 2, 0, 0, 0] },
	F: { strings: [1, 3, 3, 2, 1, 1] },
	Fm: { strings: [1, 3, 3, 1, 1, 1] },
	"F#": { strings: [2, 4, 4, 3, 2, 2] },
	"F#m": { strings: [2, 4, 4, 2, 2, 2] },
	G: { strings: [3, 2, 0, 0, 0, 3] },
	Gm: { strings: [3, 5, 5, 3, 3, 3] },
	"G#": { strings: [4, 6, 6, 5, 4, 4] },
	"G#m": { strings: [4, 6, 6, 4, 4, 4] },
	A: { strings: ["x", 0, 2, 2, 2, 0] },
	Am: { strings: ["x", 0, 2, 2, 1, 0] },
	"A#": { strings: ["x", 1, 3, 3, 3, 1] },
	"A#m": { strings: ["x", 1, 3, 3, 2, 1] },
	B: { strings: ["x", 2, 4, 4, 4, 2] },
	Bm: { strings: ["x", 2, 4, 4, 3, 2] },
};
