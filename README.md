# sqliteler

A browser-based SQLite notebook — think Jupyter, but for SQL (and Python). Runs entirely client-side.

## Setup

### Prerequisites

- Node.js + pnpm

### Install dependencies

```bash
pnpm install
```

### Set up Pyodide

Python cells run via [Pyodide](https://pyodide.org) in a Web Worker. The runtime and required packages must be present in `public/pyodide/` before starting the dev server.

**1. Extract the Pyodide core archive** (already included in the repo root):

```bash
mkdir -p public/pyodide
tar -xjf pyodide-core-0.29.3.tar.bz2 -C public/pyodide --strip-components=1
```

**2. Download required packages** from the Pyodide CDN:

```bash
curl -o public/pyodide/micropip-0.11.0-py3-none-any.whl \
  https://cdn.jsdelivr.net/pyodide/v0.29.3/full/micropip-0.11.0-py3-none-any.whl

curl -o public/pyodide/sqlite3-1.0.0-cp313-cp313-pyodide_2025_0_wasm32.whl \
  https://cdn.jsdelivr.net/pyodide/v0.29.3/full/sqlite3-1.0.0-cp313-cp313-pyodide_2025_0_wasm32.whl
```

> `public/pyodide/` is gitignored. Run these steps once after cloning.

### Start the dev server

```bash
pnpm dev
```

## Commands

```bash
pnpm dev      # Start dev server
pnpm build    # Type-check and build for production
pnpm lint     # Run Biome linter
pnpm format   # Format code with Biome
pnpm preview  # Preview production build
```
