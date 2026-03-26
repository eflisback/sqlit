import { expose } from 'comlink';
import { initInputBuffer, setPyGetter } from './input';
import { getPyInstance, resetPython, runPython } from './python';
import { loadFromUrl, query, resetDb } from './sqlite';

setPyGetter(getPyInstance);

const reset = (): void => {
	resetDb();
	resetPython();
};

export const engine = { initInputBuffer, query, loadFromUrl, runPython, reset };
export type Engine = typeof engine;
expose(engine);
