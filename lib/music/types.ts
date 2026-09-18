/** Canonical open maj/min chord ids: root letter (+ optional #) + optional `m`. */
export type ChordId =
	| "C"
	| "Cm"
	| "C#"
	| "C#m"
	| "D"
	| "Dm"
	| "D#"
	| "D#m"
	| "E"
	| "Em"
	| "F"
	| "Fm"
	| "F#"
	| "F#m"
	| "G"
	| "Gm"
	| "G#"
	| "G#m"
	| "A"
	| "Am"
	| "A#"
	| "A#m"
	| "B"
	| "Bm";

export type ChordQuality = "maj" | "min";
