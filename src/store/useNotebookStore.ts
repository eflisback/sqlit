import { create } from 'zustand';
import type { CellData } from './types';
import welcomeCell from './welcome-cell.md?raw';

interface NotebookStore {
	cells: CellData[];
	editable: boolean;
	insertCell: (cellData: CellData, index: number) => void;
	updateCell: (id: string, cellData: CellData) => void;
	removeCell: (id: string) => void;
}

export const useNotebookStore = create<NotebookStore>((set) => ({
	editable: false,
	cells: [
		{
			id: 'welcome-markdown',
			type: 'markdown',
			content: welcomeCell,
		},
		{
			id: 'welcome-load',
			type: 'load',
			url: '/examples/users.sqlite',
		},
		{
			id: 'welcome-sql',
			type: 'sql',
			content: 'SELECT * FROM users',
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
	updateCell: (id, cellData) =>
		set((prev) => ({
			cells: prev.cells.map((cell) => (cell.id === id ? cellData : cell)),
		})),
	removeCell: (id) =>
		set((prev) => ({
			cells: prev.cells.filter((cellData) => cellData.id !== id),
		})),
}));
