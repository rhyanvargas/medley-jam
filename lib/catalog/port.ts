import type { ChordId } from "@/lib/music/types";

export type Song = {
	id: string;
	title: string;
	artist: string;
	progression: ChordId[];
	lyrics?: string;
};

export interface SongCatalog {
	searchByProgression(chords: ChordId[]): Song[];
}