import type { PyodideAPI } from 'pyodide';
import {
	PROMPT_OFFSET,
	RESP_LEN_OFFSET,
	RESP_OFFSET,
	STATUS_OFFSET,
	STDOUT_LEN_OFFSET,
	STDOUT_OFFSET,
} from '../input-protocol';

let inputBuffer: SharedArrayBuffer | null = null;
let pyGetter: (() => PyodideAPI | null) | null = null;

export const isInputReady = (): boolean => inputBuffer !== null;

export const setPyGetter = (fn: () => PyodideAPI | null): void => {
	pyGetter = fn;
};

export const initInputBuffer = (sab: SharedArrayBuffer): void => {
	inputBuffer = sab;
	const statusView = new Int32Array(sab, STATUS_OFFSET, 2);
	const promptBytes = new Uint8Array(sab, PROMPT_OFFSET, 4096);
	const stdoutLenView = new Int32Array(sab, STDOUT_LEN_OFFSET, 1);
	const stdoutBytes = new Uint8Array(sab, STDOUT_OFFSET, 32768);
	const responseLenView = new Int32Array(sab, RESP_LEN_OFFSET, 1);
	const responseBytes = new Uint8Array(sab, RESP_OFFSET, 4096);
	const encoder = new TextEncoder();
	const decoder = new TextDecoder();
	(globalThis as unknown as Record<string, unknown>).requestInput = (
		prompt: string,
	): string => {
		// Flush current stdout into SAB before signalling the main thread
		const py = pyGetter?.();
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
};
