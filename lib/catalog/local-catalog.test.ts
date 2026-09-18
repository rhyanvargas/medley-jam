import { describe, expect, it } from "vitest";
import type { ChordId } from "@/lib/music/types";
import { createLocalCatalog } from "./local-catalog";
import type { Song } from "./port";
import { SEED_SONGS } from "./seed-songs";

const DEMO: ChordId[] = ["G", "D", "Em", "C"];

const fixtureSongs: Song[] = [
	{
		id: "s1",
		title: "Demo Hit A",
		artist: "Artist A",
		progression: ["G", "D", "Em", "C"],
	},
	{
		id: "s2",
		title: "Demo Hit B",
		artist: "Artist B",
		progression: ["Am", "G", "D", "Em", "C", "G"],
	},
	{
		id: "s3",
		title: "Different Loop",
		artist: "Artist C",
		progression: ["Am", "F", "C", "G"],
	},
	{
		id: "s4",
		title: "Reordered",
		artist: "Artist D",
		progression: ["G", "Em", "D", "C"],
	},
	{
		id: "s5",
		title: "Transposed",
		artist: "Artist E",
		progression: ["A", "E", "F#m", "D"],
	},
];

describe("createLocalCatalog.searchByProgression", () => {
	it("returns songs whose progression contains the exact contiguous sequence", () => {
		const catalog = createLocalCatalog(fixtureSongs);
		const results = catalog.searchByProgression(DEMO);

		expect(results.map((s) => s.id).sort()).toEqual(["s1", "s2"]);
	});

	it("returns an empty list for a known miss", () => {
		const catalog = createLocalCatalog(fixtureSongs);
		const results = catalog.searchByProgression(["E", "A", "D", "G"]);

		expect(results).toEqual([]);
	});

	it("does not match transposed or reordered progressions", () => {
		const catalog = createLocalCatalog(fixtureSongs);

		expect(catalog.searchByProgression(["A", "E", "F#m", "D"]).map((s) => s.id)).toEqual([
			"s5",
		]);
		expect(catalog.searchByProgression(DEMO).map((s) => s.id)).not.toContain("s4");
		expect(catalog.searchByProgression(DEMO).map((s) => s.id)).not.toContain("s5");
	});
});

describe("SEED_SONGS", () => {
	it("has at least 20 songs and ≥3 sharing G–D–Em–C", () => {
		expect(SEED_SONGS.length).toBeGreaterThanOrEqual(20);

		const catalog = createLocalCatalog(SEED_SONGS);
		const demoHits = catalog.searchByProgression(DEMO);
		expect(demoHits.length).toBeGreaterThanOrEqual(3);
	});
});
