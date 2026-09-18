---
description: "Exact build/test/lint/typecheck commands for this repo"
alwaysApply: true
---

# Project Commands (build/test/lint/typecheck)

This rule lists the **exact** commands the agent must use to verify work in this repo.

## Detected stack

| Item | Value |
|------|--------|
| Package manager | pnpm (`packageManager`: `pnpm@9.15.0`) |
| Language / framework | TypeScript + Next.js 16.3.4 (App Router) + React 19.2.8 |
| CSS | Tailwind CSS 4 (`@tailwindcss/postcss`) |
| Linter | ESLint 9 + `eslint-config-next` (`pnpm lint`) |
| Typecheck | TypeScript via `tsc --noEmit` (no dedicated script yet) |
| Test runner | Vitest (`pnpm test` / `pnpm test:watch`) |
| CI | none detected |

## Commands

```bash
# Install:     pnpm install
# Dev server:  pnpm dev
# Lint:        pnpm lint
# Typecheck:   pnpm exec tsc --noEmit
# Build:       pnpm build
# Start:       pnpm start
# Test:        pnpm test
# Test watch:  pnpm test:watch
```

### Verify before claiming done

Run in order:

```bash
pnpm test && pnpm lint && pnpm exec tsc --noEmit && pnpm build
```

**Fail-closed:** if test, lint, typecheck, or build fails, fix before claiming done.

## Required environment

- none for local verify (no `.env` required for scaffold)
