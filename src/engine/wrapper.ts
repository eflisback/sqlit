import { type Remote, wrap } from 'comlink';
import type { Engine } from './worker';

const worker = new Worker(new URL('./worker.ts', import.meta.url), {
	type: 'module',
});

export const engine: Remote<Engine> = wrap(worker);
