import type { Database, Sqlite3Static } from '@sqliteai/sqlite-wasm';
import sqlite3InitModule from '@sqliteai/sqlite-wasm';
import { expose } from 'comlink';
import { loadPyodide, type PyodideAPI } from 'pyodide';
import type { CellResult } from '@/store/types';

let sqlite3: Sqlite3Static | null = null;
let db: Database | null = null;
let py: PyodideAPI | null = null;
let inputBuffer: SharedArrayBuffer | null = null;

const INPUT_OVERRIDE_PY = `import builtins, js
def _input(prompt=''):
    return js.requestInput(str(prompt))
builtins.input = _input`;

const getSqlite3 = async (): Promise<Sqlite3Static> => {
	if (!sqlite3) {
		sqlite3 = await sqlite3InitModule();
	}
	return sqlite3;
};

const getDb = async (): Promise<[Database, Sqlite3Static]> => {
	const s3 = await getSqlite3();
	if (!db) {
		db = new s3.oo1.DB(':memory:');
	}
	return [db, s3];
};

const getPy = async () => {
	if (!py) {
		py = await loadPyodide({ indexURL: '/pyodide/' });
		await py.loadPackage('micropip');
		await py.runPythonAsync(
			'import micropip; await micropip.install("sqlite3")',
		);
	}
	return py;
};

export const engine = {
	initInputBuffer: (sab: SharedArrayBuffer): void => {
		inputBuffer = sab;
		const statusView = new Int32Array(sab, 0, 2);
		const promptBytes = new Uint8Array(sab, 8, 4096);
		const stdoutLenView = new Int32Array(sab, 4104, 1);
		const stdoutBytes = new Uint8Array(sab, 4108, 32768);
		const responseLenView = new Int32Array(sab, 36876, 1);
		const responseBytes = new Uint8Array(sab, 36880, 4096);
		const encoder = new TextEncoder();
		const decoder = new TextDecoder();
		(globalThis as unknown as Record<string, unknown>).requestInput = (
			prompt: string,
		): string => {
			// Flush current stdout into SAB before signalling the main thread
			if (!py) return '';
			const stdoutVal = py.runPython('sys.stdout.getvalue()') as string;
			py.runPython('sys.stdout = io.StringIO(); sys.stderr = sys.stdout');
			const stdoutEncoded = encoder.encode(stdoutVal);
			stdoutBytes.set(stdoutEncoded.subarray(0, 32768));
			stdoutLenView[0] = Math.min(stdoutEncoded.length, 32768);

			const encoded = encoder.encode(prompt);
			promptBytes.set(encoded.subarray(0, 4096));
			statusView[1] = Math.min(encoded.length, 4096);
			Atomics.store(statusView, 0, 1);
			Atomics.notify(statusView, 0);
			Atomics.wait(statusView, 0, 1);
			const responseLen = responseLenView[0];
			return decoder.decode(responseBytes.slice(0, responseLen));
		};
	},
	query: async (sql: string): Promise<CellResult> => {
		const [currentDb] = await getDb();
		const rows = currentDb.exec(sql, {
			rowMode: 'object',
			returnValue: 'resultRows',
		});
		const rowsAffected = currentDb.changes();
		return { kind: 'table', rows, rowsAffected };
	},
	loadFromUrl: async (url: string): Promise<void> => {
		const s3 = await getSqlite3();
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch: ${response.status} ${response.statusText}!`,
			);
		}
		const buffer = await response.arrayBuffer();
		const bytes = new Uint8Array(buffer);

		const magic = new TextDecoder().decode(bytes.slice(0, 16));
		if (magic !== 'SQLite format 3\0') {
			throw new Error('Not a valid SQLite database file!');
		}

		if (db) {
			db.close();
			db = null;
		}

		const newDb = new s3.oo1.DB(':memory:');
		const p = s3.wasm.allocFromTypedArray(bytes);
		const rc = s3.capi.sqlite3_deserialize(
			newDb,
			'main',
			p,
			bytes.byteLength,
			bytes.byteLength,
			s3.capi.SQLITE_DESERIALIZE_FREEONCLOSE |
				s3.capi.SQLITE_DESERIALIZE_RESIZEABLE,
		);
		if (rc !== 0) {
			newDb.close();
			throw new Error(`Failed to deserialize database (code ${rc})!`);
		}
		db = newDb;
	},
	runPython: async (code: string): Promise<CellResult> => {
		const [currentDb, s3] = await getDb();
		const pyodide = await getPy();

		// Sync SQLite with Pyodide VFS so Python can access the live database
		const dbBytes = s3.capi.sqlite3_js_db_export(currentDb);
		pyodide.FS.writeFile('/memory.db', dbBytes);

		try {
			pyodide.runPython(
				'import sys, io; sys.stdout = io.StringIO(); sys.stderr = sys.stdout',
			);
			if (inputBuffer) {
				pyodide.runPython(INPUT_OVERRIDE_PY);
			}
			await pyodide.runPythonAsync(code);
			const output = pyodide.runPython('sys.stdout.getvalue()') as string;

			// Sync Pyodide VFS with SQLite in case Python mutated the database
			const updated = pyodide.FS.readFile('/memory.db') as Uint8Array;
			const p = s3.wasm.allocFromTypedArray(updated);
			s3.capi.sqlite3_deserialize(
				currentDb,
				'main',
				p,
				updated.byteLength,
				updated.byteLength,
				s3.capi.SQLITE_DESERIALIZE_FREEONCLOSE |
					s3.capi.SQLITE_DESERIALIZE_RESIZEABLE,
			);
			db = currentDb;

			return { kind: 'text', text: output || '(no output)' };
		} catch (e) {
			let stdout = '';
			try {
				stdout = pyodide.runPython('sys.stdout.getvalue()') as string;
			} catch {
				/* stdout not set up */
			}
			const trace = e instanceof Error ? e.message : String(e);
			return { kind: 'error', message: stdout ? `${stdout}\n${trace}` : trace };
		}
	},
};

export type Engine = typeof engine;

expose(engine);
