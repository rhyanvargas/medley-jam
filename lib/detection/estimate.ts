import type { ChordId, ChordQuality } from "@/lib/music/types";

const PC_TO_ROOT = [
	"C",
	"C#",
	"D",
	"D#",
	"E",
	"F",
	"F#",
	"G",
	"G#",
	"A",
	"A#",
	"B",
] as const;

/** Major/minor triad intervals from root (pitch classes). */
const TEMPLATES: Record<ChordQuality, readonly number[]> = {
	maj: [0, 4, 7],
	min: [0, 3, 7],
};

export type ChordEstimate = {
	rootPc: number;
	quality: ChordQuality;
};

export type ScoredChord = ChordEstimate & { score: number };

/** Map a pitch-class + quality estimate onto the 24-chord vocabulary. */
export function nearestOpenChord(estimate: ChordEstimate | null): ChordId | null {
	if (!estimate) return null;
	const root = PC_TO_ROOT[((estimate.rootPc % 12) + 12) % 12];
	return (estimate.quality === "min" ? `${root}m` : root) as ChordId;
}

function chromaEnergy(chroma: ArrayLike<number>): number {
	let sum = 0;
	for (let i = 0; i < 12; i++) sum += chroma[i] ?? 0;
	return sum;
}

function normalizeChroma(chroma: ArrayLike<number>): Float32Array {
	const out = new Float32Array(12);
	let max = 0;
	for (let i = 0; i < 12; i++) max = Math.max(max, chroma[i] ?? 0);
	if (max <= 0) return out;
	for (let i = 0; i < 12; i++) out[i] = (chroma[i] ?? 0) / max;
	return out;
}

/** Cosine-style template scores for all 24 open maj/min chords. */
export function scoreChordTemplates(chroma: ArrayLike<number>): ScoredChord[] {
	const norm = normalizeChroma(chroma);
	const scored: ScoredChord[] = [];

	for (let rootPc = 0; rootPc < 12; rootPc++) {
		for (const quality of ["maj", "min"] as const) {
			const intervals = TEMPLATES[quality];
			let score = 0;
			for (const interval of intervals) {
				score += norm[(rootPc + interval) % 12];
			}
			// Penalize strong energy on the wrong third (maj vs min).
			const wrongThird = quality === "maj" ? 3 : 4;
			score -= 0.55 * norm[(rootPc + wrongThird) % 12];
			scored.push({ rootPc, quality, score });
		}
	}

	scored.sort((a, b) => b.score - a.score);
	return scored;
}

/**
 * Chroma → best maj/min triad. Returns null when energy is low or the
 * top two candidates are too close (ambiguous).
 */
export function estimateChordFromChroma(
	chroma: ArrayLike<number>,
	options: { minEnergy?: number; minMargin?: number; minScore?: number } = {},
): ChordEstimate | null {
	const minEnergy = options.minEnergy ?? 0.08;
	const minMargin = options.minMargin ?? 0.12;
	const minScore = options.minScore ?? 1.35;

	if (chromaEnergy(chroma) < minEnergy) return null;

	const ranked = scoreChordTemplates(chroma);
	const best = ranked[0];
	const second = ranked[1];
	if (!best || best.score < minScore) return null;
	if (second && best.score - second.score < minMargin) return null;

	return { rootPc: best.rootPc, quality: best.quality };
}

/**
 * Fold an FFT magnitude spectrum into a 12-bin pitch-class profile.
 * Uses log-frequency weighting so higher harmonics don't dominate.
 */
export function spectrumToChroma(
	magnitudes: ArrayLike<number>,
	sampleRate: number,
): Float32Array {
	const chroma = new Float32Array(12);
	const binCount = magnitudes.length;
	const nyquist = sampleRate / 2;
	const minHz = 80;
	const maxHz = Math.min(2000, nyquist);

	// Analyser frequencyBinCount = fftSize/2 → bin k is k * sampleRate / fftSize.
	const fftSize = binCount * 2;
	for (let bin = 1; bin < binCount; bin++) {
		const freq = (bin * sampleRate) / fftSize;
		if (freq < minHz || freq > maxHz) continue;
		const mag = magnitudes[bin] ?? 0;
		if (mag <= 0) continue;
		const midi = 12 * Math.log2(freq / 440) + 69;
		if (!Number.isFinite(midi)) continue;
		const pc = ((Math.round(midi) % 12) + 12) % 12;
		// Mild log compression reduces spectral tilt bias.
		chroma[pc] += Math.log1p(mag);
	}

	return chroma;
}
