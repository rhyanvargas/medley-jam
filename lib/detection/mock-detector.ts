import type { ChordId } from "@/lib/music/types";
import type { ChordDetector } from "./port";

type MockDetectorOptions = {
	sequence?: (ChordId | null)[];
	intervalMs?: number;
	denyPermission?: boolean;
};

export function createMockDetector(options: MockDetectorOptions = {}): ChordDetector {
	const sequence = options.sequence ?? ["G"];
	const intervalMs = options.intervalMs ?? 50;
	const listeners = new Set<(chord: ChordId | null) => void>();
	let timer: ReturnType<typeof setInterval> | null = null;
	let index = 0;

	const emit = (chord: ChordId | null) => {
		for (const listener of listeners) listener(chord);
	};

	return {
		async start() {
			if (options.denyPermission) {
				throw new Error("Microphone permission denied");
			}
			if (timer) return;
			index = 0;
			timer = setInterval(() => {
				const chord = sequence[Math.min(index, sequence.length - 1)] ?? null;
				index += 1;
				emit(chord);
			}, intervalMs);
		},
		stop() {
			if (timer) {
				clearInterval(timer);
				timer = null;
			}
			emit(null);
		},
		subscribe(cb) {
			listeners.add(cb);
			return () => {
				listeners.delete(cb);
			};
		},
	};
}
