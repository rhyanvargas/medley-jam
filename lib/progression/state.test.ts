import { describe, expect, it } from "vitest";
import type { Song, SongCatalog } from "@/lib/catalog/port";
import {
	canShowFind,
	createInitialState,
	progressionReducer,
	type ProgressionAction,
	type ProgressionState,
} from "./state";

const hit: Song = {
	id: "hit",
	title: "Hit",
	artist: "Artist",
	progression: ["G", "D", "Em", "C"],
};

const catalog: SongCatalog = {
	searchByProgression: (chords) =>
		chords.join(",") === "G,D,Em,C" ? [hit] : [],
};

function reduce(
	state: ProgressionState,
	...actions: ProgressionAction[]
): ProgressionState {
	return actions.reduce(progressionReducer, state);
}

describe("canShowFind", () => {
	it("is true only when all four slots are filled", () => {
		const empty = createInitialState();
		expect(canShowFind(empty)).toBe(false);

		const partial = reduce(
			empty,
			{ type: "confirmChord", chord: "G" },
			{ type: "confirmChord", chord: "D" },
			{ type: "confirmChord", chord: "Em" },
		);
		expect(canShowFind(partial)).toBe(false);

		const full = reduce(partial, { type: "confirmChord", chord: "C" });
		expect(canShowFind(full)).toBe(true);
	});
});

describe("progressionReducer", () => {
	it("confirmChord writes focused slot and advances to next open slot", () => {
		const state = reduce(createInitialState(), {
			type: "confirmChord",
			chord: "G",
		});

		expect(state.slots).toEqual(["G", null, null, null]);
		expect(state.focusIndex).toBe(1);
	});

	it("findSongs stores exact catalog matches", () => {
		const filled = reduce(
			createInitialState(),
			{ type: "confirmChord", chord: "G" },
			{ type: "confirmChord", chord: "D" },
			{ type: "confirmChord", chord: "Em" },
			{ type: "confirmChord", chord: "C" },
			{ type: "findSongs", catalog },
		);

		expect(filled.results).toEqual([hit]);
	});

	it("clearSlot empties results and hides Find when below four filled", () => {
		const withResults = reduce(
			createInitialState(),
			{ type: "confirmChord", chord: "G" },
			{ type: "confirmChord", chord: "D" },
			{ type: "confirmChord", chord: "Em" },
			{ type: "confirmChord", chord: "C" },
			{ type: "findSongs", catalog },
			{ type: "clearSlot", index: 1 },
		);

		expect(withResults.slots[1]).toBeNull();
		expect(withResults.results).toEqual([]);
		expect(canShowFind(withResults)).toBe(false);
	});

	it("overwriting a chord while still full clears results but keeps Find visible", () => {
		const edited = reduce(
			createInitialState(),
			{ type: "confirmChord", chord: "G" },
			{ type: "confirmChord", chord: "D" },
			{ type: "confirmChord", chord: "Em" },
			{ type: "confirmChord", chord: "C" },
			{ type: "findSongs", catalog },
			{ type: "focusSlot", index: 1 },
			{ type: "confirmChord", chord: "A" },
		);

		expect(edited.slots).toEqual(["G", "A", "Em", "C"]);
		expect(edited.results).toEqual([]);
		expect(canShowFind(edited)).toBe(true);
	});

	it("createSetlist locks editing", () => {
		const locked = reduce(
			createInitialState(),
			{ type: "confirmChord", chord: "G" },
			{ type: "confirmChord", chord: "D" },
			{ type: "confirmChord", chord: "Em" },
			{ type: "confirmChord", chord: "C" },
			{ type: "createSetlist" },
		);

		expect(locked.locked).toBe(true);

		const afterEditAttempt = reduce(locked, {
			type: "confirmChord",
			chord: "A",
		});
		expect(afterEditAttempt.slots).toEqual(["G", "D", "Em", "C"]);
	});

	it("startNewSetlist unlocks, clears slots, and empties results", () => {
		const reset = reduce(
			createInitialState(),
			{ type: "confirmChord", chord: "G" },
			{ type: "confirmChord", chord: "D" },
			{ type: "confirmChord", chord: "Em" },
			{ type: "confirmChord", chord: "C" },
			{ type: "findSongs", catalog },
			{ type: "createSetlist" },
			{ type: "startNewSetlist" },
		);

		expect(reset).toMatchObject({
			slots: [null, null, null, null],
			locked: false,
			results: [],
			focusIndex: 0,
		});
		expect(canShowFind(reset)).toBe(false);
	});

	it("setMode switches Manual/Listen", () => {
		const state = reduce(createInitialState(), {
			type: "setMode",
			mode: "listen",
		});
		expect(state.mode).toBe("listen");
	});
});
