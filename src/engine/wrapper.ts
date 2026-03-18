import { type Remote, wrap } from 'comlink';
import type { Engine } from './worker';

const worker = new Worker(new URL('./worker.ts', import.meta.url), {
	type: 'module',
});

export const engine: Remote<Engine> = wrap(worker);

const inputSAB = new SharedArrayBuffer(40976);
const statusView = new Int32Array(inputSAB, 0, 2);
const decoder = new TextDecoder();

// Queue initInputBuffer before any user runPython calls (Comlink preserves order)
engine.initInputBuffer(inputSAB);

type WaitAsyncResult = { value: Promise<'ok' | 'not-equal' | 'timed-out'> };
const waitAsync = (
	view: Int32Array,
	index: number,
	value: number,
): WaitAsyncResult =>
	(
		Atomics as unknown as {
			waitAsync: (
				view: Int32Array,
				index: number,
				value: number,
			) => WaitAsyncResult;
		}
	).waitAsync(view, index, value);

export function onInputRequest(
	cb: (stdout: string, prompt: string) => void,
): () => void {
	let cancelled = false;
	const loop = async () => {
		while (!cancelled) {
			await waitAsync(statusView, 0, 0).value;
			if (cancelled) break;
			const stdoutLen = new Int32Array(inputSAB, 4104, 1)[0];
			const stdout = decoder.decode(
				new Uint8Array(inputSAB, 4108, stdoutLen).slice(),
			);
			const promptLen = statusView[1];
			const prompt = decoder.decode(
				new Uint8Array(inputSAB, 8, promptLen).slice(),
			);
			cb(stdout, prompt);
			await waitAsync(statusView, 0, 1).value;
		}
	};
	loop();
	return () => {
		cancelled = true;
	};
}

export function submitInput(text: string): void {
	const encoder = new TextEncoder();
	const encoded = encoder.encode(text);
	new Uint8Array(inputSAB, 36880, 4096).set(encoded.subarray(0, 4096));
	new Int32Array(inputSAB, 36876, 1)[0] = Math.min(encoded.length, 4096);
	Atomics.store(statusView, 0, 0);
	Atomics.notify(statusView, 0);
}
