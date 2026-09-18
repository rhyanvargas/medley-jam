# Medley Jam

Build a four-chord progression (Manual pick or Listen via mic), then find songs that use that **exact** sequence from a local seeded catalog.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Listen mode (mic)

- Prefer a **Chrome-class** desktop browser for the POC.
- Switching to **Listen** prompts for microphone permission.
- If permission is denied, use **Switch to Manual** (or retry after allowing the mic in browser settings).
- Detection uses FFT chroma → maj/min triad matching, then **holds** the last stable chord through silence (needs ~10 agreeing frames to switch). Confirm before it fills a slot.

### Verify

```bash
pnpm test && pnpm lint && pnpm exec tsc --noEmit && pnpm build
```
