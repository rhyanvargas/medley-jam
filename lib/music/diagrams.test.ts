import { describe, expect, it } from "vitest";
import { ALL_OPEN_CHORDS } from "./chords";
import { CHORD_DIAGRAMS } from "./diagrams";

describe("CHORD_DIAGRAMS", () => {
	it("provides diagram data for every open maj/min chord", () => {
		expect(Object.keys(CHORD_DIAGRAMS)).toHaveLength(24);

		for (const chord of ALL_OPEN_CHORDS) {
			const diagram = CHORD_DIAGRAMS[chord];
			expect(diagram, `missing diagram for ${chord}`).toBeDefined();
			expect(diagram.strings).toHaveLength(6);
			for (const fret of diagram.strings) {
				expect(fret === "x" || (typeof fret === "number" && fret >= 0)).toBe(true);
			}
		}
	});
});
