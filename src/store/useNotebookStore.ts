import { create } from 'zustand';
import type { CellData } from './types';

interface NotebookStore {
	cells: CellData[];
}

export const useNotebookStore = create<NotebookStore>(() => ({
	cells: [
		{
			id: 'example',
			type: 'markdown',
			content: 'Welcome to SQLiteler!',
		},
	],
}));
