# sqlit

An SQL notebook that runs entirely in the browser.

## Overview

Sqlit is an SQL and Python notebook designed for database educators and students. The tool is completely web based and can be run on modern web browsers with no installation required. While similar alternatives exist, sqlit aims to be particularly convenient with a Markdown-based file format and browser-native execution.

## Cell Types

| Type       | Description                                   |
|------------|-----------------------------------------------|
| `sql`      | Execute SQL queries, results shown as a table |
| `python`   | Run Python; database accessible via `sqlite3` |
| `markdown` | Documentation or instructions                 |
| `load`     | Load an external `.sqlite` file from a URL    |

## Running in the Browser

In order to run SQL queries in the browser, sqlit uses [SQLite](https://sqlite.org/), which has been compiled to [WebAssembly](https://webassembly.org/) (abbreviated _Wasm_), the low-level language that web browsers understand. Databases are loaded into SQLite memory, which users can query using SQL directly, or via the `sqlite3` Python module. 

Python is supported through [Pyodide](https://pyodide.com/), which is a project that compiles the standard interpreter to Wasm so that it can run natively in browsers.

There are many benefits to keeping all execution in the browser. The main one is that it requires no installation or setup for users. They can just go to the website, load a sheet, then get to work. Another advantage is that the app is simple to maintain and host, as it only requires a web server to host a few files.

## The `.sqlit.md` File Format

A feature which has been prioritized is keeping the file format of sheets **human-readable** and **easy to manage externally**. Users often want to version-track sheets, like lectures or lab instructions, and reviewing diffs is significantly easier in a Markdown-based format than in a JSON-based one (like Jupyter's `.ipynb` format). 

The main drawback with a less complex file format is that it puts some limitations on what kind of data can be stored. For the purpose of having students go through SQL and Python assignments, or a lecturer demonstrating database concepts, this is okay.

As for editing a `.sqlit.md` sheet externally, it's 99% conventional Markdown. The only exception is for creating runnable cells, which is done by wrapping code blocks in four backticks instead of three. As an example, this is how you would create an executable SQL cell in your sqlit sheet:

`````
````sql
SELECT sqlite_version() AS version
````
`````

For Python or Load cells, just replace the `sql` flag with `python` or `load` respectively. This allows external editors like VS Code to still give you features like syntax highlighting for the given language when editing. It also allows for regular non-interactive code blocks to be added to your sheet by writing regular Markdown code blocks (three backticks).

## Local Development

Developing locally is straightforward. The project uses [Vite](https://vite.dev/) for bundling and [pnpm](https://pnpm.io/) as its Node.js package manager (which can be installed from the default one, [npm](https://docs.npmjs.com/cli/v11/configuring-npm/install)). Once these are installed on your computer, simply run the commands below.

### Install Dependencies

```bash
pnpm install
```

### Run Development Server
```bash
pnpm dev
```

### Other Commands

```bash
pnpm dev        # Fetch Pyodide + start dev server
pnpm build      # Fetch Pyodide + type-check + production build
pnpm preview    # Preview production build
pnpm test       # Run tests
pnpm lint       # Biome linter
pnpm format     # Biome formatter
```

## Known Issues

At the moment, Python's `input()` calls don't work in Safari. The reason is that the web server has the header `Cross-Origin-Embedder-Policy` set to `credentialless`, which allows for the use of [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) (used for Python input handling) while also letting the app fetch resources (like `.sqlite` files or images) from external sources. Unlike Chromium-based browsers (Chrome, Edge, Brave, ...) and Firefox, Safari does not yet implement this header value.
