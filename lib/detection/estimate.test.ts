import { describe, expect, it } from "vitest";
import {
	estimateChordFromChroma,
	scoreChordTemplates,
} from "./estimate";

describe("estimateChordFromChroma", () => {
	it("picks a major triad when root + third + fifth dominate", () => {
		const chroma = new Float32Array(12);
		chroma[0] = 1; // C
		chroma[4] = 0.85; // E
		chroma[7] = 0.9; // G
		expect(estimateChordFromChroma(chroma)).toEqual({ rootPc: 0, quality: "maj" });
	});

	it("picks a minor triad when root + flat third + fifth dominate", () => {
		const chroma = new Float32Array(12);
		chroma[4] = 1; // E
		chroma[7] = 0.85; // G
		chroma[11] = 0.9; // B
		expect(estimateChordFromChroma(chroma)).toEqual({ rootPc: 4, quality: "min" });
	});

	it("returns null when energy is too low or ambiguous", () => {
		expect(estimateChordFromChroma(new Float32Array(12))).toBeNull();

		const noisy = new Float32Array(12);
		noisy.fill(0.4);
		expect(estimateChordFromChroma(noisy)).toBeNull();
	});
});

describe("scoreChordTemplates", () => {
	it("ranks C major above C minor for a C-major-like chroma", () => {
		const chroma = new Float32Array(12);
		chroma[0] = 1;
		chroma[4] = 0.9;
		chroma[7] = 0.95;
		const ranked = scoreChordTemplates(chroma);
		expect(ranked[0]).toMatchObject({ rootPc: 0, quality: "maj" });
		expect(ranked[0].score).toBeGreaterThan(ranked.find((r) => r.quality === "min" && r.rootPc === 0)!.score);
	});
});
