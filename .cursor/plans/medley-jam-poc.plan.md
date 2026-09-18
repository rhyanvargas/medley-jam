---
name: Medley Jam POC
overview: "Implement the Medley Jam POC happy path: 4-slot progression builder (Manual + Listen), local seeded exact-match song search, fretboard diagrams, and Create/Start-new setlist gate — behind SongCatalog and ChordDetector ports, with a Manual→Find tracer before mic work."
todos:
  - id: T0
    content: REQ-019 — Add Vitest harness; update project-cmds verify chain
    status: completed
  - id: T1
    content: REQ-003 — Domain types + 24 open maj/min chord vocabulary
    status: completed
  - id: T2
    content: REQ-010/014/015/018 — SongCatalog port, seed ≥20, exact search + tests
    status: completed
  - id: T3
    content: REQ-001/005/008/009/021 — Progression state machine + unit tests
    status: completed
  - id: T4
    content: TRACER — Manual slots + Find + results UI (mock detector N/A)
    status: completed
  - id: T5
    content: "VERIFY — Tracer gate: tests + lint + tsc + build"
    status: completed
  - id: T6
    content: REQ-004 — Chord diagram map (24) + Manual hover tooltip
    status: completed
  - id: T7
    content: REQ-006/007/016/017 — ChordDetector port, mock tests, Web Audio adapter
    status: completed
  - id: T8
    content: REQ-002/006/007/016 — Listen mode UI + mic denial recovery
    status: completed
  - id: T9
    content: REQ-013/020 — Create Setlist freeze + Start new setlist clear
    status: completed
  - id: T10
    content: REQ-all — Compose home page; polish empty/locked states
    status: completed
  - id: T11
    content: VERIFY/REVIEW — Full verify + separate /review against spec
    status: completed
isProject: false
---

# Medley Jam POC Implementation Plan

> **For agentic workers:** Implement task-by-task against the living spec. Prefer TDD at the ports (`SongCatalog`, progression state, `ChordDetector`). Do not start T6–T9 until **T5 tracer verify** passes.

**Goal:** Ship a browser POC where a guitarist builds a 4-chord progression (Manual or Listen), finds exact-match songs from a local seed, then freezes via Create Setlist / resets via Start new.

**Architecture:** Client-heavy Next.js App Router UI. Domain logic in `lib/` behind ports: `SongCatalog.searchByProgression`, `ChordDetector` (mic adapter), and a pure progression state module. No auth/DB. Mic requires `"use client"` boundary.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind 4, Vitest (new), Web Audio / `getUserMedia` for Listen.

**Spec:** [`.cursor/docs/specs/medley-jam-poc.md`](../docs/specs/medley-jam-poc.md)

## Analyze summary (pre-plan)

| Finding                                  | Resolution                                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------ |
| REQ-013 Create Setlist timing ambiguous  | Locked: appears at 4/4 with Find (`REQ-013` updated)                                             |
| Stale results after edit                 | Added `REQ-021` — clear results on progression change                                            |
| Find hide vs results                     | `REQ-009` — clear results when Find hides                                                        |
| Architecture / mic integration ambiguous | **Tracer required** (T4–T5) before Listen (T7–T8)                                                |
| No test runner                           | T0 adds Vitest; update `.cursor/rules/project-cmds/RULE.md`                                      |
| Architecture packet                      | **N/A — ports + client boundary locked in spec**; no irreversible infra. Container sketch below. |

Open questions in spec: **none blocking.**

## Architecture sketch (containers)

```
[Browser]
  ├── UI (app/page + components)  — slots, Manual/Listen, Find, results, setlist gate
  ├── Progression state (lib/)    — pure; slots, mode, locked, results
  ├── SongCatalog (local seed)    — exact subsequence match
  └── ChordDetector (Web Audio)   — live chord estimate → confirm
```

No server persistence. Optional later: remote catalog adapter implementing same port.

## Global constraints

- Exact 4-chord match only; no transpose/similar
- 24 open maj/min only
- Local seed catalog only (no UG scrape / live Hooktheory)
- Editable until Create Setlist; Start new clears all
- Find hidden until 4/4
- Chrome-class laptop browser for mic POC
- Verify: `pnpm test` (after T0) && `pnpm lint` && `pnpm exec tsc --noEmit` && `pnpm build`

## File map

| Path                                    | Responsibility                                       |
| --------------------------------------- | ---------------------------------------------------- |
| `lib/music/types.ts`                    | `ChordId`, `ChordQuality`, `Song`, progression types |
| `lib/music/chords.ts`                   | Canonical list of 24 chords + labels                 |
| `lib/music/diagrams.ts`                 | Fretboard diagram data for each of 24                |
| `lib/catalog/port.ts`                   | `SongCatalog` interface                              |
| `lib/catalog/seed-songs.ts`             | ≥20 seeded songs                                     |
| `lib/catalog/local-catalog.ts`          | Exact-match `searchByProgression`                    |
| `lib/progression/state.ts`              | Pure state + reducers/actions                        |
| `lib/detection/port.ts`                 | `ChordDetector` interface                            |
| `lib/detection/web-audio-detector.ts`   | Mic adapter                                          |
| `components/progression/*`              | Slots, mode toggle, Manual picker, Listen panel      |
| `components/catalog/*`                  | Find button, results list                            |
| `components/setlist/*`                  | Create / Start new                                   |
| `components/chord/FretboardDiagram.tsx` | Diagram render                                       |
| `app/page.tsx`                          | Compose POC surface                                  |
| `vitest.config.mts`                     | Test config                                          |
| `*.test.ts` colocated under `lib/`      | Unit tests                                           |

## Requirements → tasks

| Requirement                        | Tasks  |
| ---------------------------------- | ------ |
| REQ-019 (no auth) + verify harness | T0     |
| REQ-003                            | T1     |
| REQ-010, 011, 012, 014, 015, 018   | T2, T4 |
| REQ-001, 005, 008, 009, 021        | T3, T4 |
| REQ-002 (Manual path)              | T4     |
| Tracer verify                      | T5     |
| REQ-004                            | T6     |
| REQ-006, 007, 016, 017             | T7, T8 |
| REQ-002 Listen path                | T8     |
| REQ-013, 020                       | T9     |
| Compose / polish                   | T10    |
| Final verify + review              | T11    |

---

## Tasks

### T0 — Vitest harness + project-cmds

**Files:**

- Create: `vitest.config.mts`
- Modify: `package.json` (scripts `test`, `test:watch`; add `vitest`)
- Modify: `.cursor/rules/project-cmds/RULE.md` (add Test to verify chain)

**Steps:**

- [x] Add Vitest with TypeScript path alias parity to `tsconfig`
- [x] Script: `"test": "vitest run"`, `"test:watch": "vitest"`
- [x] Update project-cmds verify to: `pnpm test && pnpm lint && pnpm exec tsc --noEmit && pnpm build`
- [x] Smoke: `pnpm test` exits 0 with zero tests or one trivial assert

---

### T1 — Domain types + 24-chord vocabulary

**Files:**

- Create: `lib/music/types.ts`, `lib/music/chords.ts`
- Test: `lib/music/chords.test.ts`

**Produces:**

- `ChordId` string union or branded id covering `C`…`B` × `maj`/`min` (notation locked in code, e.g. `C`, `Cm` or `C:maj` — pick one and use everywhere)
- `ALL_OPEN_CHORDS: ChordId[]` length 24
- `displayLabel(chord: ChordId): string`

**Steps:**

- [x] Write failing test: `ALL_OPEN_CHORDS` has 24 unique ids; includes e.g. `G`, `Em`
- [x] Implement vocabulary
- [x] `pnpm test` pass

**Notation locked:** maj = root (`G`), min = root + `m` (`Em`); sharp roots use `#` in ids (`C#`, `C#m`); `displayLabel` maps `#` → `♯`.

---

### T2 — SongCatalog port, seed, exact search

**Files:**

- Create: `lib/catalog/port.ts`, `lib/catalog/seed-songs.ts`, `lib/catalog/local-catalog.ts`
- Test: `lib/catalog/local-catalog.test.ts`

**Interfaces:**

```ts
export type Song = {
	id: string;
	title: string;
	artist: string;
	progression: ChordId[]; // absolute chords in order
	lyrics?: string;
};

export interface SongCatalog {
	searchByProgression(chords: ChordId[]): Song[];
}
```

**Match rule:** song matches iff `progression` contains `chords` as a contiguous subsequence of length 4 (exact equality per slot).

**Seed:** ≥20 songs; at least 3 share a demo progression such as `G, D, Em, C`.

**Steps:**

- [ ] Failing tests: known hit returns those songs; known miss returns `[]`; does not match transposed/reordered
- [ ] Implement `createLocalCatalog(seed)`
- [ ] Curate seed data
- [ ] `pnpm test` pass

---

### T3 — Progression state machine

**Files:**

- Create: `lib/progression/state.ts`
- Test: `lib/progression/state.test.ts`

**Produces (pure):**

- State: `slots: (ChordId | null)[4]`, `focusIndex`, `mode: 'manual' | 'listen'`, `locked: boolean`, `results: Song[]`, `listening: boolean`, `liveDetected: ChordId | null`, `micError: string | null`
- Actions: `setMode`, `focusSlot`, `confirmChord`, `clearSlot`, `findSongs(catalog)`, `createSetlist`, `startNewSetlist`, `setLiveDetected`, `setMicError`, …
- Rules encoded from REQ-005, 008, 009, 013, 020, 021 (auto-advance, hide Find when `<4`, clear results on edit/clear/start new, freeze when locked)

**Steps:**

- [ ] Failing tests for: confirm advances; Find visibility predicate `slots.every(Boolean)`; edit clears results; Create locks; Start new resets
- [ ] Implement reducer
- [ ] `pnpm test` pass

---

### T4 — TRACER UI (Manual → Find → results)

**Files:**

- Create: `components/progression/ChordSlots.tsx`, `ModeToggle.tsx`, `ManualChordPicker.tsx`
- Create: `components/catalog/FindSongsButton.tsx`, `SongResults.tsx`
- Modify: `app/page.tsx` (client compose)
- Diagrams: optional stub “diagram coming” or skip hover until T6 (hover required by REQ-004 — if deferred, note gap; prefer minimal SVG placeholder labeled by chord id)

**Scope:** Manual mode only. No real mic. Wire `createLocalCatalog(seed)`.

**Acceptance for tracer:** User can fill 4 slots manually → Find appears → results show title/artist/progression → empty state for miss.

**Steps:**

- [ ] Wire page to progression state + local catalog
- [ ] Pin-style 4 slots; Manual picker with 24 chords
- [ ] Find + results + empty state
- [ ] Manual browser smoke via `pnpm dev`

---

### T5 — VERIFY tracer gate

**Steps:**

- [ ] `pnpm test && pnpm lint && pnpm exec tsc --noEmit && pnpm build`
- [ ] Confirm tracer acceptance above
- [ ] **Do not proceed to T7–T8 until this passes**

---

### T6 — Fretboard diagrams + hover

**Files:**

- Create: `lib/music/diagrams.ts`, `components/chord/FretboardDiagram.tsx`
- Test: `lib/music/diagrams.test.ts` (every of 24 has diagram data)
- Modify: `ManualChordPicker.tsx` — hover/focus tooltip with diagram

**Steps:**

- [ ] Define diagram schema (string frets / finger positions — keep simple)
- [ ] Populate 24 canonical open-position shapes
- [ ] Tooltip on hover
- [ ] `pnpm test` pass

---

### T7 — ChordDetector port + Web Audio adapter

**Files:**

- Create: `lib/detection/port.ts`, `lib/detection/web-audio-detector.ts`
- Test: `lib/detection/port.test.ts` (mock detector behavior / mapping helpers)
- Optional: pitch/chroma helper module; prefer small dependency-free POC (autocorrelation or chroma binning) — accuracy POC-grade

**Interfaces:**

```ts
export interface ChordDetector {
	start(): Promise<void>;
	stop(): void;
	/** Subscribe to live estimates; may emit null when unclear */
	subscribe(cb: (chord: ChordId | null) => void): () => void;
}
```

**Steps:**

- [ ] Port + mock implementation for tests
- [ ] Web Audio `getUserMedia` adapter; map estimate → nearest of 24 or null
- [ ] Permission denial → reject/start error surfaced to UI (T8)

---

### T8 — Listen mode UI

**Files:**

- Create: `components/progression/ListenPanel.tsx`
- Modify: slots (listening state), `app/page.tsx`

**Steps:**

- [ ] Mode toggle Manual | Listen
- [ ] Listening slot shows live detected chord; Confirm / keep playing
- [ ] Confirm writes slot + advances (reuse state actions)
- [ ] Mic denied → message + switch to Manual
- [ ] Browser smoke with real guitar/mic

---

### T9 — Create Setlist + Start new

**Files:**

- Create: `components/setlist/SetlistGate.tsx`
- Modify: page + locked slot styles

**Steps:**

- [ ] Create Setlist visible at 4/4; freezes slots; locked confirmation UI
- [ ] Start new setlist unlocks, clears slots, hides Find, empties results
- [ ] Unit coverage already in T3; UI smoke

---

### T10 — Compose + polish

**Files:**

- Modify: `app/page.tsx`, `app/globals.css` / layout as needed
- Modify: `README.md` only if user-facing run/mic notes needed (or defer to `/update-readme`)

**Steps:**

- [ ] Single composition for POC surface (not a dashboard)
- [ ] Empty / listening / locked / no-results states clear
- [ ] Responsive enough for laptop + phone layout (mic may be laptop-first)

---

### T11 — Final verify + separate review

**Steps:**

- [ ] `pnpm test && pnpm lint && pnpm exec tsc --noEmit && pnpm build`
- [ ] Manual checklist vs spec acceptance (Manual path, Listen path, setlist gate)
- [ ] Run **separate** `/review --spec .cursor/docs/specs/medley-jam-poc.md` (generator ≠ evaluator)
- [ ] Update plan todo statuses to `completed` as done

## Risks

| Risk                               | Mitigation                                                                 |
| ---------------------------------- | -------------------------------------------------------------------------- |
| Mic chord accuracy poor            | Confirm/retry UX; mock + Manual path always works; POC-grade detection OK  |
| Diagram data tedious               | Ship simple fret grids; refine later                                       |
| Seed quality / copyright of titles | Use well-known public repertoire metadata only; no scraped tab text/lyrics |
| Scope creep (transpose, lyrics)    | Out of scope — refuse in implement                                         |

## Handoff / Progress

- **Updated:** 2026-09-17
- **Done:** T2–T10 — SongCatalog + seed (≥20, G–D–Em–C demo hits), progression reducer, Manual→Find tracer (+ T5 verify), fretboard diagrams/hover, ChordDetector port + Web Audio adapter, Listen UI + mic denial recovery, Create/Start-new setlist gate, composed home page
- **Files:** `lib/catalog/*`, `lib/progression/*`, `lib/music/diagrams*`, `lib/detection/*`, `components/**`, `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `.cursor/plans/medley-jam-poc.plan.md`
- **POC status:** Accepted as good enough for now (2026-09-17).
- **Now:** Post-POC backlog captured; pick next item to spec when ready.
- **Backlog:** `.cursor/docs/product-backlog.md` — BL-001 Reset Chord, BL-002 Lyrics+chords, BL-003 Live mode, BL-004 Save/edit/share setlist, BL-005 Jam Mode (hands-free; gated on detection quality).
- **Watchouts:** Mic detection is POC-grade; Jam Mode (BL-005) blocked on stability/accuracy work.
- **Git:** dirty (POC implement uncommitted; user did not request commit)
- **Spec:** `.cursor/docs/specs/medley-jam-poc.md`
