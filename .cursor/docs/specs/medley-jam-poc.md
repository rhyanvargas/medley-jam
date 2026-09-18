# Medley Jam POC — Progression Builder + Exact Song Match

## Overview

Prove the core Medley Jam loop for guitarists: build a four-chord progression (manual pick or mic listen), then find songs that use that **exact** progression from a local seeded catalog. Each capability below is a demonstrable POC slice; together they form the first shippable happy path.

**Size:** Medium (multi-capability POC; plan before implement)  
**Entry mode:** Requirements-First  
**Artifact home:** `.cursor/docs/specs/`

## Assumptions

Confirmed unless corrected:

1. Target user: guitarist practicing and/or building a performance set.
2. Progression length: exactly **four** ordered chord slots.
3. Chord vocabulary (v1): **all 12 roots × major and minor** (24 open shapes; expand later with 7ths/etc.).
4. Modes: two explicit modes — **Manual** and **Listen**.
5. Listen / mic chord detection is **required** in the first shippable slice.
6. Match rule: **exact** same four chords in the same order (no transpose / similar yet).
7. Song catalog for POC: **local seeded dataset** behind a swappable catalog port (not Hooktheory/Chordonomicon yet).
8. Results show title, artist, and song progression; lyrics only if seed data includes them (not required).
9. Slots remain editable until **Create Setlist** (label TBD); that action is a **stub/gate** in this POC.
10. Fretboard tooltip: **one canonical open-position** diagram per chord (no alternate voicings).
11. **Find songs** appears only once all four slots are filled; results clear when the user starts a **new setlist**.
12. **Create Setlist** (POC): freeze the progression on the same page; show a lightweight locked/confirmation state (not a full setlist editor); **Start new setlist** unlocks, clears slots, hides Find, and empties results.

## Core POC capabilities

| ID | Capability | POC success |
|----|------------|-------------|
| C1 | Progression builder (4-slot / pin UI) | Fill, edit, clear, auto-advance |
| C2 | Manual chord select | Open maj/min list + hover diagram |
| C3 | Listen / chord detection | Live detected chord → confirm |
| C4 | Chord diagram catalog | Canonical open diagrams for all v1 chords |
| C5 | Local song catalog | Seed ≥20 songs with absolute progressions |
| C6 | Exact progression search | Returns only exact 4-chord matches |
| C7 | Results list | Title, artist, progression |
| C8 | Create Setlist gate | Freeze progression; Start new clears slots + results |

## Requirements

### Functional

- [ ] **REQ-001:** The app shows four ordered chord slots in a pin-style layout (empty / filled / listening).
- [ ] **REQ-002:** User can choose **Manual** or **Listen** mode explicitly.
- [ ] **REQ-003:** In Manual mode, the UI shows a list of **all 12 roots × major and minor** (24 chords) for the focused slot; no other qualities in v1.
- [ ] **REQ-004:** Hovering a chord in the Manual list shows a tooltip with that chord’s canonical open-position fretboard / tab diagram.
- [ ] **REQ-005:** Selecting a chord in Manual mode writes it into the focused slot and moves focus to the next open slot (if any).
- [ ] **REQ-006:** In Listen mode, the focused slot enters a listening state; the UI shows the **currently detected** chord in real time while the mic is active.
- [ ] **REQ-007:** In Listen mode, the user can **confirm** the detected chord or keep playing until a different detection appears; confirm writes the chord and advances focus to the next open slot.
- [ ] **REQ-008:** Until Create Setlist is activated, any slot can be cleared or overwritten (Manual or Listen).
- [ ] **REQ-009:** **Find songs** is **hidden** until all four slots are filled with confirmed chords; then it appears. It is not shown disabled beforehand. If a filled slot is cleared so fewer than four remain, Find hides and results empty immediately.
- [ ] **REQ-010:** Find songs searches the local seeded catalog for songs whose progression contains the exact four-chord sequence (same chords, same order).
- [ ] **REQ-011:** Results list each match with at least **title**, **artist**, and **progression**. Lyrics may appear only when present on the seed record.
- [ ] **REQ-012:** Empty match set shows a clear empty state (no false positives).
- [ ] **REQ-013:** **Create Setlist** appears when all four slots are filled (same visibility gate as Find). Activating it freezes the progression (slots no longer editable) and shows a lightweight locked/confirmation state on the same page — not a full setlist editor. Find is not required before Create Setlist.
- [ ] **REQ-014:** Song data is loaded from a **local seed** (e.g. JSON/TS module), not a live third-party API, for this POC.
- [ ] **REQ-015:** Catalog access is behind a narrow port (e.g. `searchByProgression(chords)`) so a future remote source can replace the seed without rewriting the Find UI.
- [ ] **REQ-020:** **Start new setlist** (or equivalent) unlocks editing, clears all four slots, hides Find songs, and **empties** any previous Find results.
- [ ] **REQ-021:** If the user changes any slot chord while results are visible (still four filled, before Create Setlist), clear results immediately; Find stays visible until the next Find run.

### Non-Functional

- [ ] **REQ-016:** Mic use requires explicit browser permission; denial shows a recoverable message (user can switch to Manual).
- [ ] **REQ-017:** Chord detection must be usable on a typical laptop browser with a built-in or external mic (Chrome-class target for POC).
- [ ] **REQ-018:** Exact search over the seed set returns in interactive time (target &lt; 200ms for ≤500 seed songs).
- [ ] **REQ-019:** No authentication or persistence required for POC.

## Acceptance Criteria

### Happy path — Manual → Find

- Given four empty slots and Manual mode
- When the user fills each slot from the open maj/min list (hovering shows a fretboard diagram)
- And all four slots are confirmed
- When the user clicks Find songs
- Then every listed song’s progression contains that exact four-chord sequence
- And each result shows title, artist, and progression

### Happy path — Listen → Find

- Given Listen mode and mic permission granted
- When the user plays a chord into an empty/focused slot
- Then the UI shows the live detected chord
- When the user confirms
- Then the slot is filled and focus moves to the next open slot
- When all four are confirmed and Find songs runs
- Then results obey the same exact-match rules as Manual

### Edge cases

- Given mic permission denied
- When the user chooses Listen
- Then they see a clear error and can continue in Manual mode

- Given a progression with no seed matches
- When Find songs runs
- Then an empty state is shown (not an error crash)

- Given three slots filled
- Then Find songs is not visible

- Given all four filled, before Create Setlist
- When the user changes slot 2 (still four filled)
- Then Find songs remains visible and the next Find uses the updated progression

- Given all four filled with visible Find / results
- When one slot is cleared (before Create Setlist)
- Then Find songs hides and results clear immediately

- Given results visible and still four slots filled
- When the user changes slot 2 to a different chord
- Then results clear; Find remains visible

- Given Create Setlist has frozen the progression
- When the user chooses Start new setlist
- Then slots are empty and editable, Find is hidden, and results are empty

### Chord vocabulary

- Given the Manual chord list
- Then exactly 24 open maj/min entries appear (12 roots × maj/min); no 7ths, sus, or other qualities

## Test Strategy

| REQ | Seam | How to prove |
|-----|------|--------------|
| REQ-003–005, 008–009 | UI / component | Manual fill, hover diagram present, advance, edit before setlist |
| REQ-006–007, 016–017 | Detection port + UI | Mock detector for unit; manual mic smoke in browser |
| REQ-010–012, 014–015, 018 | `SongCatalog` / `searchByProgression` | Unit tests with seed fixture; known hit + known miss |
| REQ-004, C4 | Diagram map | Every v1 chord has a diagram entry |
| REQ-013, 020 | UI / state | Freeze on Create; Start new clears slots, Find, results |
| REQ-009, 021 | UI | Find hidden until 4 filled; clear results on hide or progression edit |

**Preferred seams:** (1) `SongCatalog` port, (2) `ChordDetector` port (mic adapter behind interface), (3) progression state machine / store for slots.

## Approach (POC constraints)

- **Catalog:** Ship a curated seed (≥20 songs) with absolute chord progressions chosen so at least one well-known four-chord loop (e.g. G–D–Em–C family) has multiple hits for demos.
- **Detection:** Browser mic + client-side pitch/chroma → chord estimate; accuracy need not be production-grade, but confirm/retry loop must be clear.
- **Diagrams:** Static map of all 24 open maj/min → fretboard diagram data or assets (canonical open-position shape per chord; some “open” shapes may still use common first-position fingerings).
- **Stack:** Existing Next.js app (`app/`); keep POC client-capable for mic.

## Constraints

- Must not depend on Ultimate Guitar scraping or commercial chord APIs for v1.
- Chordonomicon / Hooktheory may be evaluated later; not required to pass this POC.
- CC-BY-NC datasets must not be bundled if product intent becomes commercial without license review.

## Out of Scope

Post-POC product candidates live in [`.cursor/docs/product-backlog.md`](../product-backlog.md) (Reset Chord, lyrics+chords, Live mode, save/edit/share setlist, Jam Mode). Still deferred for this POC:

- Transposed or “similar” progression matching
- Extended chords (7, sus, dim, aug, barre variants as selectable set)
- Alternate fretboard voicings / capo diagrams
- Lyrics provider integration
- Full setlist builder, save/share, accounts, auth
- Mobile-native apps (responsive web OK)
- Offline PWA packaging

## Open Questions

_None blocking._ Resolved:

1. Chord set: all 12 × maj/min (24).
2. Create Setlist: same-page freeze + Start new setlist (recommended; locked).
3. Find songs: appear only when four slots filled; clear on new setlist.
4. Create Setlist visibility: at 4/4 with Find (Find not required first) — analyze lock.
5. Stale results: clear on progression edit while still 4/4 (`REQ-021`) — analyze lock.

## Boundaries

- **Always:** Exact-match only; local seed catalog; Manual + Listen; 24 open maj/min; editable until Create Setlist; Find appears only at 4/4.
- **Ask first:** Expanding chord vocabulary; swapping catalog to remote API; adding transpose match; real setlist persistence/UI.
- **Never (this POC):** Scrape UG live; claim production-grade detection accuracy; ship lyrics without a licensed source; full setlist editor.

## User flow (reference)

```
Choose Manual | Listen
  → fill 4 slots (confirm advances; edit anytime before Create Setlist)
  → Find songs appears (exact match on local seed)
  → results: title, artist, progression
  → Create Setlist → freeze progression (lightweight locked state)
  → Start new setlist → clear slots, hide Find, empty results
```
