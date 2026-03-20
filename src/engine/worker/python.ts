import { loadPyodide, type PyodideAPI } from 'pyodide';
import type { CellResult } from '@/store/types';
import { isInputReady } from './input';
import { getDb } from './sqlite';

let py: PyodideAPI | null = null;

const INPUT_OVERRIDE_PY = `import builtins, js
def _input(prompt=''):
    return js.requestInput(str(prompt))
builtins.input = _input`;

export const getPyInstance = (): PyodideAPI | null => py;

export const getPy = async (): Promise<PyodideAPI> => {
	if (!py) {
		py = await loadPyodide({ indexURL: '/pyodide/' });
		await py.loadPackage('micropip');
		await py.runPythonAsync(
			'import micropip; await micropip.install("sqlite3")',
		);
	}
	return py;
};

getPy();

export const runPython = async (code: string): Promise<CellResult> => {
	const [currentDb, s3] = await getDb();
	const pyodide = await getPy();

	// Sync SQLite with Pyodide VFS so Python can access the live database
	const dbBytes = s3.capi.sqlite3_js_db_export(currentDb);
	pyodide.FS.writeFile('/memory.db', dbBytes);
	pyodide.globals.set('SQLIT_MEMORY', '/memory.db');

	try {
		pyodide.runPython(
			'import sys, io; sys.stdout = io.StringIO(); sys.stderr = sys.stdout',
		);
		if (isInputReady()) {
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
};
