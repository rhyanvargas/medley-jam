---
description: "Project overview, workflow, and definition-of-done quality gates"
alwaysApply: true
---

# Project Rules

This repo is **Medley Jam** — find songs that can be played together based on the same chord progression. App stack: **Next.js 16** (App Router) + **React 19** + **TypeScript** + **Tailwind CSS 4**, package manager **pnpm**.

Formerly scaffolded as `medley-generator`; product name and folder are now `medley-jam`.

## Discovery guidelines

- Explore first: scan `app/` and existing patterns before suggesting new ones.
- Follow established conventions: match style, naming, and structure already in use.
- This Next.js version may differ from training data — read relevant guides under `node_modules/next/dist/docs/` before writing framework APIs (see `AGENTS.md`).
- When uncertain: ask rather than assume (architecture ambiguity, missing requirements, conflicting requirements).

## Architecture (where things live)

- **App**: `app/` — Next.js App Router (`layout.tsx`, `page.tsx`, `globals.css`)
- **Commands**: `.cursor/commands/` — slash-command workflows
- **Rules**: `.cursor/rules/<name>/RULE.md` — persistent constraints + quality gates
- **Skills**: `.agents/skills/` — ADSK skills (see `skills-lock.json`, `.adsk/config.json`)
- **Specs**: `.cursor/docs/specs/`
- **Plans**: `.cursor/plans/` (Cursor Plan YAML `todos` required)

## Workflow

Use the spec-driven workflow:

1. `/draft-spec` — generate a spec from an idea (preferred for new product features)
2. `/plan-impl` — create an implementation plan (medium+)
3. `/implement-spec` — implement from spec/plan
4. `/review` — post-implementation quality check

For documenting or changing existing app behavior, start with `/extract-spec` on the relevant path (e.g. `app/`).

## Definition of done (quality gates)

For any change that affects behavior:

- **Spec is testable**: requirements are specific and testable (prefer `REQ-XXX` IDs).
- **Tests included**: each implemented requirement has tests (or a short, explicit “no tests needed because…” justification when truly non-behavioral). No test runner is configured yet — add one when the first behavioral feature lands, then update `@.cursor/rules/project-cmds`.
- **Verification executed**: run the repo’s verification commands (see `@.cursor/rules/project-cmds`). If verify fails or is missing, do **not** claim implement done.
