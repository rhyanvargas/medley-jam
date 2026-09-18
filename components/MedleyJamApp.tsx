"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { FindSongsButton } from "@/components/catalog/FindSongsButton";
import { SongResults } from "@/components/catalog/SongResults";
import { ChordSlots } from "@/components/progression/ChordSlots";
import { ListenPanel } from "@/components/progression/ListenPanel";
import { ManualChordPicker } from "@/components/progression/ManualChordPicker";
import { ModeToggle } from "@/components/progression/ModeToggle";
import { SetlistGate } from "@/components/setlist/SetlistGate";
import { createLocalCatalog } from "@/lib/catalog/local-catalog";
import { SEED_SONGS } from "@/lib/catalog/seed-songs";
import type { ChordDetector } from "@/lib/detection/port";
import { createWebAudioDetector } from "@/lib/detection/web-audio-detector";
import {
	canShowFind,
	createInitialState,
	progressionReducer,
} from "@/lib/progression/state";

const catalog = createLocalCatalog(SEED_SONGS);

export function MedleyJamApp() {
	const [state, dispatch] = useReducer(progressionReducer, undefined, createInitialState);
	const [hasSearched, setHasSearched] = useState(false);
	const [listenAttempt, setListenAttempt] = useState(0);
	const detectorRef = useRef<ChordDetector | null>(null);

	const findVisible = canShowFind(state);

	useEffect(() => {
		if (state.mode !== "listen" || state.locked) {
			detectorRef.current?.stop();
			detectorRef.current = null;
			dispatch({ type: "setListening", listening: false });
			return;
		}

		const detector = createWebAudioDetector();
		detectorRef.current = detector;
		const unsubscribe = detector.subscribe((chord) => {
			dispatch({ type: "setLiveDetected", chord });
		});

		let cancelled = false;
		void (async () => {
			try {
				await detector.start();
				if (cancelled) {
					detector.stop();
					return;
				}
				dispatch({ type: "setMicError", message: null });
				dispatch({ type: "setListening", listening: true });
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Microphone permission denied";
				dispatch({ type: "setMicError", message });
				dispatch({ type: "setListening", listening: false });
			}
		})();

		return () => {
			cancelled = true;
			unsubscribe();
			detector.stop();
			if (detectorRef.current === detector) detectorRef.current = null;
		};
	}, [state.mode, state.locked, listenAttempt]);

	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-10 sm:py-14">
			<header className="space-y-3">
				<p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
					POC
				</p>
				<h1 className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-[var(--ink)] sm:text-6xl">
					Medley Jam
				</h1>
				<p className="max-w-xl text-base text-[var(--ink-muted)]">
					Build a four-chord progression, then find songs that use that exact sequence.
				</p>
			</header>

			<section className="space-y-4" aria-labelledby="progression-heading">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<h2
						id="progression-heading"
						className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]"
					>
						Progression
					</h2>
					<ModeToggle
						mode={state.mode}
						disabled={state.locked}
						onChange={(mode) => dispatch({ type: "setMode", mode })}
					/>
				</div>

				<ChordSlots
					slots={state.slots}
					focusIndex={state.focusIndex}
					locked={state.locked}
					listening={state.listening}
					onFocus={(index) => dispatch({ type: "focusSlot", index })}
					onClear={(index) => {
						setHasSearched(false);
						dispatch({ type: "clearSlot", index });
					}}
				/>
			</section>

			{state.mode === "manual" ? (
				<section aria-labelledby="manual-heading" className="space-y-2">
					<h2
						id="manual-heading"
						className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]"
					>
						Manual chords
					</h2>
					<ManualChordPicker
						disabled={state.locked}
						onSelect={(chord) => {
							setHasSearched(false);
							dispatch({ type: "confirmChord", chord });
						}}
					/>
				</section>
			) : (
				<section aria-labelledby="listen-heading" className="space-y-2">
					<h2
						id="listen-heading"
						className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]"
					>
						Listen
					</h2>
					<ListenPanel
						listening={state.listening}
						liveDetected={state.liveDetected}
						micError={state.micError}
						locked={state.locked}
						onConfirm={() => {
							if (!state.liveDetected) return;
							setHasSearched(false);
							dispatch({ type: "confirmChord", chord: state.liveDetected });
						}}
						onRetryPermission={() => {
							dispatch({ type: "setMicError", message: null });
							setListenAttempt((n) => n + 1);
						}}
						onSwitchToManual={() => {
							dispatch({ type: "setMicError", message: null });
							dispatch({ type: "setMode", mode: "manual" });
						}}
					/>
				</section>
			)}

			<section className="flex flex-col gap-5" aria-labelledby="results-heading">
				<div className="flex flex-wrap items-center gap-4">
					<h2
						id="results-heading"
						className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]"
					>
						Matches
					</h2>
					<FindSongsButton
						visible={findVisible && !state.locked}
						disabled={state.locked}
						onClick={() => {
							dispatch({ type: "findSongs", catalog });
							setHasSearched(true);
						}}
					/>
					<SetlistGate
						canCreate={findVisible}
						locked={state.locked}
						onCreate={() => dispatch({ type: "createSetlist" })}
						onStartNew={() => {
							setHasSearched(false);
							dispatch({ type: "startNewSetlist" });
						}}
					/>
				</div>
				{!state.locked ? (
					<SongResults results={state.results} searched={hasSearched && findVisible} />
				) : null}
			</section>
		</div>
	);
}
