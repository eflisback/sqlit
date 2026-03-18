import { useCallback } from 'react';
import { useSheetStore } from '@/store';
import type { CellData } from '@/store/types';
import { executeCellData } from './executeCellData';
import type { CellStatus } from './types';

export function useRunCell(cellData: CellData): {
	isLoading: boolean;
	anyRunning: boolean;
	status: CellStatus;
	run: () => Promise<void>;
	runWithPrior: () => Promise<void>;
	showRunWithPrior: boolean;
} {
	const updateCell = useSheetStore((state) => state.updateCell);
	const runningCellId = useSheetStore((state) => state.runningCellId);
	const setRunningCellId = useSheetStore((state) => state.setRunningCellId);
	const cells = useSheetStore((state) => state.cells);
	const status: CellStatus =
		cellData.result === null
			? 'none'
			: cellData.result.kind === 'error'
				? 'failure'
				: 'success';

	const isLoading = runningCellId === cellData.id;
	const anyRunning = runningCellId !== null;

	const idx = cells.findIndex((c) => c.id === cellData.id);
	const showRunWithPrior = cells.slice(0, idx).some((c) => c.type !== 'markdown');

	const run = useCallback(async () => {
		if (anyRunning) return;
		setRunningCellId(cellData.id);
		try {
			const result = await executeCellData(cellData);
			updateCell(cellData.id, { ...cellData, result } as CellData);
		} catch (e: unknown) {
			const message = e instanceof Error ? e.message : String(e);
			updateCell(cellData.id, { ...cellData, result: { kind: 'error', message } } as CellData);
		} finally {
			setRunningCellId(null);
		}
	}, [cellData, anyRunning, updateCell, setRunningCellId]);

	const runWithPrior = useCallback(async () => {
		if (anyRunning) return;
		const allCells = useSheetStore.getState().cells;
		const currentIdx = allCells.findIndex((c) => c.id === cellData.id);
		const toRun = allCells.slice(0, currentIdx + 1).filter((c) => c.type !== 'markdown');

		for (const cell of toRun) {
			setRunningCellId(cell.id);
			try {
				const result = await executeCellData(cell);
				updateCell(cell.id, { ...cell, result } as CellData);
			} catch (e: unknown) {
				const message = e instanceof Error ? e.message : String(e);
				updateCell(cell.id, { ...cell, result: { kind: 'error', message } } as CellData);
				setRunningCellId(null);
				return;
			}
		}
		setRunningCellId(null);
	}, [cellData, anyRunning, updateCell, setRunningCellId]);

	return { isLoading, anyRunning, status, run, runWithPrior, showRunWithPrior };
}
