import { create } from 'zustand';
import type { CellData } from './types';
import welcomeCell from './welcome-cell.md?raw';

interface NotebookStore {
	cells: CellData[];
}

export const useNotebookStore = create<NotebookStore>(() => ({
	cells: [
		{
			id: 'welcome',
			type: 'markdown',
			content: welcomeCell,
		},
		{
			id: 'sqliteVersion',
			type: 'sql',
			content: 'SELECT sqlite_version() AS version',
			result: null,
		},
	],
}));
