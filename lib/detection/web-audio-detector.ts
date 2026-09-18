import type { ChordId } from "@/lib/music/types";
import {
	estimateChordFromChroma,
	nearestOpenChord,
	spectrumToChroma,
} from "./estimate";
import type { ChordDetector } from "./port";
import { createChordLock } from "./stability";

type WebAudioDetectorDeps = {
	getUserMedia?: typeof navigator.mediaDevices.getUserMedia;
	audioContextFactory?: () => AudioContext;
	/** Consecutive agreeing frames before lock/switch (default 10 ≈ 160ms @ 60fps). */
	consecutiveRequired?: number;
};

/**
 * Browser mic adapter: FFT chroma → maj/min templates, with sticky lock
 * so silence/noise does not clear or thrash the last detected chord.
 */
export function createWebAudioDetector(
	deps: WebAudioDetectorDeps = {},
): ChordDetector {
	const listeners = new Set<(chord: ChordId | null) => void>();
	const lock = createChordLock({
		consecutiveRequired: deps.consecutiveRequired ?? 10,
	});
	let stream: MediaStream | null = null;
	let context: AudioContext | null = null;
	let analyser: AnalyserNode | null = null;
	let raf = 0;
	let lastEmitted: ChordId | null | undefined;
	let freqBuffer: Float32Array<ArrayBuffer> | null = null;

	const emit = (chord: ChordId | null) => {
		if (chord === lastEmitted) return;
		lastEmitted = chord;
		for (const listener of listeners) listener(chord);
	};

	const tick = () => {
		if (!analyser || !context || !freqBuffer) return;
		analyser.getFloatFrequencyData(freqBuffer);

		// Convert dB magnitudes to linear-ish positives for chroma folding.
		const linear = new Float32Array(freqBuffer.length);
		for (let i = 0; i < freqBuffer.length; i++) {
			linear[i] = Math.pow(10, freqBuffer[i] / 20);
		}

		const chroma = spectrumToChroma(linear, context.sampleRate);
		const estimate = estimateChordFromChroma(chroma);
		const candidate = nearestOpenChord(estimate);
		emit(lock.observe(candidate));
		raf = requestAnimationFrame(tick);
	};

	return {
		async start() {
			const getUserMedia =
				deps.getUserMedia ??
				navigator.mediaDevices?.getUserMedia?.bind(navigator.mediaDevices);
			if (!getUserMedia) {
				throw new Error("Microphone is not available in this browser");
			}

			try {
				stream = await getUserMedia({
					audio: {
						echoCancellation: false,
						noiseSuppression: false,
						autoGainControl: false,
					},
					video: false,
				});
			} catch {
				throw new Error("Microphone permission denied");
			}

			const AudioCtx =
				deps.audioContextFactory ??
				(() =>
					new (window.AudioContext ||
						(window as unknown as { webkitAudioContext: typeof AudioContext })
							.webkitAudioContext)());

			context = AudioCtx();
			const source = context.createMediaStreamSource(stream);
			analyser = context.createAnalyser();
			analyser.fftSize = 4096;
			analyser.smoothingTimeConstant = 0.7;
			source.connect(analyser);
			freqBuffer = new Float32Array(analyser.frequencyBinCount);
			lock.reset();
			lastEmitted = undefined;
			raf = requestAnimationFrame(tick);
		},
		stop() {
			if (raf) cancelAnimationFrame(raf);
			raf = 0;
			analyser = null;
			freqBuffer = null;
			if (context) {
				void context.close();
				context = null;
			}
			if (stream) {
				for (const track of stream.getTracks()) track.stop();
				stream = null;
			}
			lock.reset();
			lastEmitted = undefined;
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
