# Medley Jam — Product Backlog

Post-POC candidates captured after accepting the progression-builder POC (2026-09-17). Not committed delivery; prioritize and spec before implement.

**POC baseline:** `.cursor/docs/specs/medley-jam-poc.md` (accepted as good enough for now)

## Backlog

| ID | Item | Area | Notes / dependencies | Priority hint |
|----|------|------|----------------------|---------------|
| BL-001 | **Reset Chord** — clear the current listening chord in Listen | Listen UX | Clears live/detected chord (and optionally unfills focused slot) without starting a new setlist. Distinct from Start new setlist. | Quick win |
| BL-002 | **Lyrics with chords** — show lyrics alongside chords per song | Catalog / Results | Needs licensed or original lyric source; POC seed may not include lyrics. Pair with chord timing/alignment later. | Medium |
| BL-003 | **Live mode** — other users can watch a live session and play along | Realtime / Multiplayer | Session share link; broadcast progression + current slot/state. Auth optional for v1 viewers. | Large |
| BL-004 | **Save / edit / share setlist** — persist setlists with lyrics + chords per song | Setlist / Persistence | Replaces Create Setlist gate stub with real editor; shareable URL or export. Depends on BL-002 for lyric-rich shares. | Large |
| BL-005 | **Jam Mode (hands-free)** — detect a repeated progression, lock one chord at a time, then auto-run Find when complete; **Reset Jam** clears the board | Listen / Detection | Dependent on chord-detection stability/accuracy (still refining). Separate from Manual confirm loop. | Discovery / gated |

## Detail

### BL-001 — Reset Chord (Listen)

- **Problem:** While listening, a wrong or stale live detection sticks; user needs a one-tap clear without resetting the whole progression.
- **Outcome:** In Listen section, **Reset Chord** clears the current listening / detected chord state for the focused slot (define: live preview only vs. also clearing a already-confirmed slot value).
- **Not:** Full board clear (that remains Start new setlist / Reset Jam).

### BL-002 — Lyrics with each song (with chords)

- **Problem:** Guitarists want words + chords in one place while learning or performing matches.
- **Outcome:** Each song result (and later setlist song) can display lyrics annotated with chords when available.
- **Constraint:** Do not ship scraped/commercial lyrics without a license review (see POC boundaries).

### BL-003 — Live mode (play along)

- **Problem:** Bandmates / friends want to follow the host’s session in real time.
- **Outcome:** Host starts a live session; others open a view-only (or sync) client and see progression / current focus to play along.
- **Likely needs:** Realtime transport, session IDs, presence; decide host vs. follower edit rights.

### BL-004 — Save / edit / share setlist

- **Problem:** Create Setlist today only freezes the page; users need durable, editable, shareable setlists.
- **Outcome:** Save setlist (songs + chords + lyrics when present), edit order/contents, share link or export.
- **Builds on:** POC Create Setlist gate; BL-002 for lyric-rich setlists.

### BL-005 — Jam Mode — hands-free Listen

- **Problem:** Confirm-per-chord breaks flow when jamming; users want to play a loop and let the app lock the progression.
- **Behavior (intent):**
  1. Detect a whole **repeated** progression.
  2. Lock one chord at a time as confidence builds.
  3. When all four (or N) chords are locked, automatically generate / run the song list.
  4. **Reset Jam** clears the whole board.
- **Gate:** Ship only when chord detection is stable/accurate enough; until then keep Manual + confirm Listen as primary path.

## Suggested sequencing (draft)

1. **BL-001** — small UX polish on existing Listen path.
2. **BL-005** — only after detection quality bar is met (parallel detection hardening).
3. **BL-002** — catalog/content work; unblocks richer setlists.
4. **BL-004** — persistence + share once content model is clear.
5. **BL-003** — realtime once single-player setlist/share story is solid (or spike earlier if demos need it).

Reorder freely after discovery / prioritization.

## Explicitly not yet backloged

Carried from POC out-of-scope (still deferred unless promoted):

- Transposed / similar progression matching
- Extended chord qualities & alternate voicings
- Accounts / auth (unless required by Live or Save)
- Mobile-native apps, offline PWA
