import { expose } from 'comlink';
import { initInputBuffer, setPyGetter } from './input';
import { getPyInstance, runPython } from './python';
import { loadFromUrl, query } from './sqlite';

setPyGetter(getPyInstance);

export const engine = { initInputBuffer, query, loadFromUrl, runPython };
export type Engine = typeof engine;
expose(engine);
