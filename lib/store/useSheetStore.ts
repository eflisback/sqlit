import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { history } from './history';
import type { CellData } from './types';
import { isExecutableCellData } from './types';

interface SheetStore {
	cells: CellData[];
	insertCell: (cellData: CellData, index: number) => void;
	updateCell: (id: string, cellData: CellData) => void;
	removeCell: (id: string) => void;
	moveCell: (id: string, direction: 'up' | 'down') => void;
	loadCells: (cells: CellData[]) => void;
	runningCellId: string | null;
	setRunningCellId: (id: string | null) => void;
	editableCellId: string | null;
	setEditalbeCellId: (id: string | null) => void;
	sharedGistId: string | null;
	setSharedGistId: (id: string | null) => void;
}

export const useSheetStore = create<SheetStore>()(
	persist(
		(set) => ({
			cells: [],
			insertCell: (cellData, index) =>
				set((prev) => ({
					cells: [
						...prev.cells.slice(0, index),
						cellData,
						...prev.cells.slice(index),
					],
					editableCellId: cellData.id,
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
			loadCells: (cells) => {
				history.clear();
				set({ cells, editableCellId: null, sharedGistId: null });
			},
			runningCellId: null,
			setRunningCellId: (id) => set({ runningCellId: id }),
			editableCellId: null,
			setEditalbeCellId: (id) => set({ editableCellId: id }),
			sharedGistId: null,
			setSharedGistId: (id) => set({ sharedGistId: id }),
		}),
		{
			name: 'sheet',
			version: 2,
			migrate: (): Partial<SheetStore> => ({ cells: [] }),
			partialize: (state) => ({
				cells: state.cells.map(
					(cell): CellData =>
						isExecutableCellData(cell) ? { ...cell, result: null } : cell,
				),
				sharedGistId: state.sharedGistId,
			}),
		},
	),
);
