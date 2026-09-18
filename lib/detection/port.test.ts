import { describe, expect, it, vi } from "vitest";
import type { ChordId } from "@/lib/music/types";
import { ALL_OPEN_CHORDS } from "@/lib/music/chords";
import { nearestOpenChord } from "./estimate";
import { createMockDetector } from "./mock-detector";
import type { ChordDetector } from "./port";

describe("nearestOpenChord", () => {
	it("maps pitch-class + quality estimates onto the 24-chord vocabulary", () => {
		expect(nearestOpenChord({ rootPc: 7, quality: "maj" })).toBe("G");
		expect(nearestOpenChord({ rootPc: 4, quality: "min" })).toBe("Em");
		expect(nearestOpenChord({ rootPc: 1, quality: "maj" })).toBe("C#");
	});

	it("returns null when estimate is unclear", () => {
		expect(nearestOpenChord(null)).toBeNull();
	});
});

describe("createMockDetector", () => {
	it("emits subscribed estimates after start and stops cleanly", async () => {
		const emitted: (ChordId | null)[] = [];
		const detector: ChordDetector = createMockDetector({
			sequence: ["G", "G", "Em", null],
			intervalMs: 5,
		});

		const unsubscribe = detector.subscribe((chord) => {
			emitted.push(chord);
		});

		await detector.start();
		await vi.waitFor(() => {
			expect(emitted.length).toBeGreaterThanOrEqual(3);
		});

		detector.stop();
		unsubscribe();
		expect(ALL_OPEN_CHORDS).toContain("G");
	});

	it("rejects start when permission is denied", async () => {
		const detector = createMockDetector({ denyPermission: true });
		await expect(detector.start()).rejects.toThrow(/permission/i);
	});
});
