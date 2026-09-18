import type { ChordId } from "@/lib/music/types";

export type ChordLockOptions = {
	/** How many consecutive agreeing frames before locking/switching. */
	consecutiveRequired?: number;
};

export type ChordLock = {
	observe(candidate: ChordId | null): ChordId | null;
	reset(): void;
};

/**
 * Sticky chord estimate: keep the last lock through silence/noise,
 * and only switch after a challenger wins N consecutive frames.
 */
export function createChordLock(options: ChordLockOptions = {}): ChordLock {
	const consecutiveRequired = Math.max(1, options.consecutiveRequired ?? 8);
	let locked: ChordId | null = null;
	let challenger: ChordId | null = null;
	let streak = 0;

	return {
		observe(candidate) {
			if (candidate === null) {
				challenger = null;
				streak = 0;
				return locked;
			}

			if (locked === null) {
				if (candidate === challenger) {
					streak += 1;
				} else {
					challenger = candidate;
					streak = 1;
				}
				if (streak >= consecutiveRequired) {
					locked = candidate;
					challenger = null;
					streak = 0;
				}
				return locked;
			}

			if (candidate === locked) {
				challenger = null;
				streak = 0;
				return locked;
			}

			if (candidate === challenger) {
				streak += 1;
			} else {
				challenger = candidate;
				streak = 1;
			}

			if (streak >= consecutiveRequired) {
				locked = candidate;
				challenger = null;
				streak = 0;
			}

			return locked;
		},
		reset() {
			locked = null;
			challenger = null;
			streak = 0;
		},
	};
}
