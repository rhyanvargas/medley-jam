import { describe, expect, it } from "vitest";
import { ALL_OPEN_CHORDS, displayLabel } from "./chords";

describe("ALL_OPEN_CHORDS", () => {
	it("has exactly 24 unique chord ids", () => {
		expect(ALL_OPEN_CHORDS).toHaveLength(24);
		expect(new Set(ALL_OPEN_CHORDS).size).toBe(24);
	});

	it("includes open maj/min examples used in demos (G, Em)", () => {
		expect(ALL_OPEN_CHORDS).toContain("G");
		expect(ALL_OPEN_CHORDS).toContain("Em");
	});

	it("covers all 12 roots × major and minor", () => {
		const roots = [
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

		for (const root of roots) {
			expect(ALL_OPEN_CHORDS).toContain(root);
			expect(ALL_OPEN_CHORDS).toContain(`${root}m`);
		}
	});
});

describe("displayLabel", () => {
	it("returns readable labels for major and minor chords", () => {
		expect(displayLabel("G")).toBe("G");
		expect(displayLabel("Em")).toBe("Em");
		expect(displayLabel("C#")).toBe("C♯");
		expect(displayLabel("A#m")).toBe("A♯m");
	});
});
