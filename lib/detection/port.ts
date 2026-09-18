import type { ChordId } from "@/lib/music/types";

export interface ChordDetector {
	start(): Promise<void>;
	stop(): void;
	/** Subscribe to live estimates; may emit null when unclear */
	subscribe(cb: (chord: ChordId | null) => void): () => void;
}
