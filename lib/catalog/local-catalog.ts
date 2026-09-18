import type { ChordId } from "@/lib/music/types";
import type { Song, SongCatalog } from "./port";

function containsContiguous(haystack: ChordId[], needle: ChordId[]): boolean {
	if (needle.length === 0) return false;
	if (needle.length > haystack.length) return false;

	for (let i = 0; i <= haystack.length - needle.length; i++) {
		let match = true;
		for (let j = 0; j < needle.length; j++) {
			if (haystack[i + j] !== needle[j]) {
				match = false;
				break;
			}
		}
		if (match) return true;
	}
	return false;
}

/** Exact contiguous subsequence match over a local seed. */
export function createLocalCatalog(songs: Song[]): SongCatalog {
	return {
		searchByProgression(chords: ChordId[]): Song[] {
			return songs.filter((song) =>
				containsContiguous(song.progression, chords),
			);
		},
	};
}
