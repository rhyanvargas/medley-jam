import type { Song, SongCatalog } from "@/lib/catalog/port";
import type { ChordId } from "@/lib/music/types";

export type ProgressionMode = "manual" | "listen";

export type ProgressionState = {
	slots: (ChordId | null)[];
	focusIndex: number;
	mode: ProgressionMode;
	locked: boolean;
	results: Song[];
	listening: boolean;
	liveDetected: ChordId | null;
	micError: string | null;
};

export type ProgressionAction =
	| { type: "setMode"; mode: ProgressionMode }
	| { type: "focusSlot"; index: number }
	| { type: "confirmChord"; chord: ChordId }
	| { type: "clearSlot"; index: number }
	| { type: "findSongs"; catalog: SongCatalog }
	| { type: "createSetlist" }
	| { type: "startNewSetlist" }
	| { type: "setLiveDetected"; chord: ChordId | null }
	| { type: "setMicError"; message: string | null }
	| { type: "setListening"; listening: boolean };

export function createInitialState(): ProgressionState {
	return {
		slots: [null, null, null, null],
		focusIndex: 0,
		mode: "manual",
		locked: false,
		results: [],
		listening: false,
		liveDetected: null,
		micError: null,
	};
}

export function canShowFind(state: ProgressionState): boolean {
	return state.slots.length === 4 && state.slots.every((slot) => slot !== null);
}

function nextOpenIndex(slots: (ChordId | null)[], from: number): number {
	for (let i = from + 1; i < slots.length; i++) {
		if (slots[i] === null) return i;
	}
	for (let i = 0; i < slots.length; i++) {
		if (slots[i] === null) return i;
	}
	return Math.min(from, slots.length - 1);
}

function filledChords(slots: (ChordId | null)[]): ChordId[] | null {
	if (!slots.every((slot) => slot !== null)) return null;
	return slots as ChordId[];
}

export function progressionReducer(
	state: ProgressionState,
	action: ProgressionAction,
): ProgressionState {
	switch (action.type) {
		case "setMode":
			return {
				...state,
				mode: action.mode,
				listening: action.mode === "listen" ? state.listening : false,
				liveDetected: action.mode === "listen" ? state.liveDetected : null,
				micError: action.mode === "manual" ? null : state.micError,
			};

		case "focusSlot": {
			if (state.locked) return state;
			if (action.index < 0 || action.index > 3) return state;
			return { ...state, focusIndex: action.index };
		}

		case "confirmChord": {
			if (state.locked) return state;
			const slots = [...state.slots] as (ChordId | null)[];
			slots[state.focusIndex] = action.chord;
			const changed =
				state.slots[state.focusIndex] !== action.chord ||
				state.results.length > 0;
			return {
				...state,
				slots,
				focusIndex: nextOpenIndex(slots, state.focusIndex),
				results: changed ? [] : state.results,
				liveDetected: null,
			};
		}

		case "clearSlot": {
			if (state.locked) return state;
			if (action.index < 0 || action.index > 3) return state;
			const slots = [...state.slots] as (ChordId | null)[];
			slots[action.index] = null;
			return {
				...state,
				slots,
				focusIndex: action.index,
				results: [],
			};
		}

		case "findSongs": {
			if (!canShowFind(state) || state.locked) return state;
			const chords = filledChords(state.slots);
			if (!chords) return state;
			return {
				...state,
				results: action.catalog.searchByProgression(chords),
			};
		}

		case "createSetlist": {
			if (!canShowFind(state)) return state;
			return {
				...state,
				locked: true,
				listening: false,
				liveDetected: null,
			};
		}

		case "startNewSetlist":
			return createInitialState();

		case "setLiveDetected":
			if (state.locked || state.mode !== "listen") return state;
			if (state.liveDetected === action.chord) return state;
			return { ...state, liveDetected: action.chord };

		case "setMicError":
			if (state.micError === action.message) return state;
			return { ...state, micError: action.message };

		case "setListening": {
			if (state.locked) return state;
			if (
				state.listening === action.listening &&
				(action.listening || state.liveDetected === null)
			) {
				return state;
			}
			return {
				...state,
				listening: action.listening,
				liveDetected: action.listening ? state.liveDetected : null,
			};
		}

		default:
			return state;
	}
}
