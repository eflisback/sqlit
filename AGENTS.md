<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start Next.js dev server
pnpm build            # Production build (includes type-checking)
pnpm start            # Run production server
pnpm lint             # Run Biome linter
pnpm format           # Format code with Biome
pnpm setup:pyodide    # Manually fetch Pyodide runtime files
pnpm test             # Run tests once
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage
```

## Architecture

sqlit is a browser-based SQLite notebook (like Jupyter, but with native SQL). It runs entirely client-side with no backend.

### Execution Engine (Web Worker)

All code execution happens in a Web Worker (`lib/engine/worker/`) to avoid blocking the UI. The main thread communicates with the worker via **Comlink** (`lib/engine/wrapper.ts`).

Worker API (exposed via Comlink):
- `query(sql)` — Run SQL against the in-memory SQLite database
- `runPython(code)` — Execute Python via Pyodide
- `loadFromUrl(url)` — Fetch and load a `.sqlite` file into memory
- `initInputBuffer(buffer)` — Set up SharedArrayBuffer for Python `input()` support

### SQLite ↔ Python Database Sync

Before each Python execution, the worker exports the SQLite database as bytes and writes it to Pyodide's virtual filesystem at `/memory.db`. After Python executes, the database is re-imported back into SQLite. Python code accesses the shared DB via `sqlite3.connect(SQLIT_MEMORY)` where `SQLIT_MEMORY="/memory.db"`.

### Python `input()` Support

Python's `input()` is intercepted using a **SharedArrayBuffer**-based protocol (`lib/engine/input-protocol.ts`). The worker blocks on the buffer waiting for user input, which the main thread writes after showing a prompt UI. The COOP/COEP headers in `next.config.ts` are required for SharedArrayBuffer to work. When `crossOriginIsolated` is false (no SharedArrayBuffer), `input()` is unavailable.

### State Management

Zustand store (`lib/store/useSheetStore.ts`) holds all cell data and is persisted to localStorage under the key `sheet` (version 2). Results are **not** persisted — only cell content (code/query text). Sheet files can be exported/imported in two formats (`lib/store/sheetFile.ts`):
- **JSON** — validated with Zod schemas (`lib/store/schema.ts`), version-tagged
- **Markdown** — custom `.sqlit.md` format using 4-backtick fenced blocks (` ````sql `, ` ````python `, ` ````load `); plain text between blocks becomes Markdown cells

Cell mutations go through a command pattern (`lib/store/commands.ts`) — each action (insert, remove, update, move cell) is a `Command` class pushed onto a history stack (`lib/store/history.ts`) for undo/redo. Adjacent markdown cells are auto-merged on import, and their merged state is tracked so undo can properly unmerge them.

### Cell Types

- **SQL** — CodeMirror editor, runs via `query()`
- **Python** — CodeMirror editor, runs via `runPython()`, shows stdout transcript and handles `input()`
- **Load** — URL input, fetches a `.sqlite` database via `loadFromUrl()`
- **Markdown** — CodeMirror editor with rendered preview

Cell rendering: `components/cells/Cell.tsx` dispatches to `ExecutableCell` (SQL/Python/Load) or `MarkdownCell`. `components/cells/CellShell.tsx` provides the common UI wrapper (header, run button, move/delete). `components/cells/useRunCell.ts` manages per-cell execution state. `CellResult` is typed as `{ kind: 'table' | 'text' | 'error'; ... }` (`lib/store/types.ts`).

### Routing

The notebook is at `app/sheet/page.tsx`. On startup it checks `?gist=<id>` and loads the sheet via `fetchGist()`. `components/sheet/BrowserNotice.tsx` renders instead of the notebook when `window.crossOriginIsolated` is false (SharedArrayBuffer unavailable — required for Python `input()`).

**Keyboard shortcuts** (implemented in `components/sheet/Sheet.tsx`):
- `Ctrl+Z` — undo
- `Ctrl+Shift+Z` — redo
- `Ctrl+S` — export sheet
- `Escape` — deselect cell

### Sharing via GitHub Gists

Sheets can be shared as GitHub Gists (private by default) containing a single `sheet.sqlit.md` file. The share flow lives in `components/modal/share/ShareModal.tsx` and `lib/api/github.ts`.

GitHub OAuth uses a popup window flow with two Next.js API routes (`app/api/oauth/start/route.ts`, `app/api/oauth/callback/route.ts`). The callback sends the access token back to the opener via `BroadcastChannel('oauth')` and closes itself. The token is stored in `useAuthStore` (persisted to localStorage under key `auth`). Required env vars: `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET` (set in Vercel or a local `.env`).

Sharing flow:
1. User authenticates — token stored in `useAuthStore`
2. Sheet is serialized to `.sqlit.md` via `exportSheetMd(cells)`
3. New gist: `createGist()` → stores gist ID in `sharedGistId` on `useSheetStore`
4. Update existing gist: `updateGist()` using the stored or selected gist ID

Loading a shared sheet: app checks for `?gist=<id>` on startup and calls `fetchGist()` (no auth required for public/unlisted gists).

## After Larger Edits

After implementing a plan or making larger edits, always run these before asking for review:

```bash
pnpm format   # Auto-fixes formatting
pnpm lint     # Check for lint errors
pnpm test     # Run test suite
```

## Conventions

- Path alias `@/` maps to the project root (e.g. `@/lib/...`, `@/components/...`)
- Biome for linting and formatting (tabs, single quotes)
- CSS modules with **camelCase** class names in both `.module.css` files and TSX access (e.g. `.noticeHeader` in CSS, `styles.noticeHeader` in TSX). Next.js hardcodes `exportLocalsConvention: 'asIs'` — no automatic kebab→camelCase translation.
- Props interfaces for React components are named `ComponentNameProps` (e.g. `SheetLoaderProps` for `SheetLoader`)
