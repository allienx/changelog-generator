# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run type-check   # TypeScript type checking (no emit)
npm run bundle       # Bundle src/main.ts → dist/index.js via esbuild
```

There are no test or lint commands. Prettier is used for formatting (no semicolons, single quotes, trailing commas).

## Architecture

This is a **GitHub Action** that generates markdown changelogs by comparing commits between two Git refs using the GitHub API.

**Runtime:** Node.js 24, entry point `dist/index.js` (bundled by esbuild from `src/main.ts`).

### Action Inputs/Output

Defined in `action.yml`:

- Inputs: `github-token` (required), `release-tag`, `base`, `head`
- Output: `summary` — the generated markdown changelog

### Execution Flow (`src/main.ts`)

1. Resolve `base` ref: use provided value → latest release tag (`get-most-recent-tag.ts`) → first commit SHA (`get-first-commit-sha.ts`)
2. Compare commits between `base` and `head` via `compare-commits.ts`
3. Format into markdown via `get-commits-summary.ts` (bullet list with commit message, author, short SHA link, and compare link)
4. Set `summary` output via `@actions/core`

### Supporting Modules

| File                      | Purpose                                                         |
| ------------------------- | --------------------------------------------------------------- |
| `get-most-recent-tag.ts`  | Fetches latest GitHub release tag; returns `""` on failure      |
| `get-first-commit-sha.ts` | Paginates all commits to find the first SHA                     |
| `compare-commits.ts`      | Wraps GitHub's compare commits API endpoint                     |
| `get-commits-summary.ts`  | Formats comparison response into markdown                       |
| `get-release-commits.ts`  | Builds commit ranges across multiple releases (used by scripts) |
| `update-release-body.ts`  | Updates an existing release body via Octokit                    |

### Build

`esbuild.config.js` bundles `src/main.ts` into `dist/index.js` (minified, with source maps, Node.js platform). The `dist/` directory is committed and must be updated before releasing.

### Release Workflow

`.github/workflows/create-release.yml` triggers on PRs merged to `main` with a `release-*` branch prefix. It extracts the version, runs the action to generate the changelog, then creates a GitHub release.
