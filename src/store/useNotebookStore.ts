import { create } from 'zustand';
import type { CellData } from './types';
import welcomeCell from './welcome-cell.md?raw';

interface NotebookStore {
	cells: CellData[];
	editable: boolean;
	insertCell: (cellData: CellData, index: number) => void;
	removeCell: (id: string) => void;
}

export const useNotebookStore = create<NotebookStore>((set) => ({
	editable: false,
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
			editable: true,
			result: null,
		},
	],
	insertCell: (cellData, index) =>
		set((prev) => ({
			cells: [
				...prev.cells.slice(0, index),
				cellData,
				...prev.cells.slice(index),
			],
		})),
	removeCell: (id) =>
		set((prev) => ({
			cells: prev.cells.filter((cellData) => cellData.id !== id),
		})),
}));
