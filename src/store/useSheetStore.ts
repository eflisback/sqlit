import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isExecutableCellData } from './types';
import type { CellData } from './types';
import welcomeCell from './welcome-cell.md?raw';

interface SheetStore {
	cells: CellData[];
	insertCell: (cellData: CellData, index: number) => void;
	updateCell: (id: string, cellData: CellData) => void;
	removeCell: (id: string) => void;
	moveCell: (id: string, direction: 'up' | 'down') => void;
	runningCellId: string | null;
	setRunningCellId: (id: string | null) => void;
	isEditable: boolean;
	setIsEditable: (isEditable: boolean) => void;
}

export const useSheetStore = create<SheetStore>()(
	persist(
		(set) => ({
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
					result: null,
				},
				{
					id: 'welcome-sql',
					type: 'sql',
					content: 'SELECT * FROM users',
					result: null,
				},
				{
					id: 'welcome-python',
					type: 'python',
					content:
						'import sqlite3\n\ncon = sqlite3.connect("/memory.db")\ncur = con.cursor()\nfor row in cur.execute("SELECT * FROM users"):\n    print(row)',
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
			moveCell: (id, direction) =>
				set((state) => {
					const idx = state.cells.findIndex((c) => c.id === id);
					const swap = direction === 'up' ? idx - 1 : idx + 1;
					if (swap < 0 || swap >= state.cells.length) return state;
					const cells = [...state.cells];
					[cells[idx], cells[swap]] = [cells[swap], cells[idx]];
					return { cells };
				}),
			runningCellId: null,
			setRunningCellId: (id) => set({ runningCellId: id }),
			isEditable: false,
			setIsEditable: (isEditable) => set({ isEditable }),
		}),
		{
			name: 'sheet',
			partialize: (state) => ({
				cells: state.cells.map(
					(cell): CellData =>
						isExecutableCellData(cell) ? { ...cell, result: null } : cell,
				),
			}),
		},
	),
);
