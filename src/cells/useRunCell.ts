import { useCallback, useState } from 'react';
import { useSheetStore } from '@/store';
import type { CellData, CellResult } from '@/store/types';
import type { CellStatus } from './types';

export function useRunCell<T extends CellData>(
	cellData: T,
	execute: (cellData: T) => Promise<CellResult>,
): { isLoading: boolean; status: CellStatus; run: () => Promise<void> } {
	const updateCell = useSheetStore((state) => state.updateCell);
	const [isLoading, setIsLoading] = useState(false);
	const [status, setStatus] = useState<CellStatus>('none');

	const run = useCallback(async () => {
		setIsLoading(true);
		try {
			const result = await execute(cellData);
			updateCell(cellData.id, { ...cellData, result } as CellData);
			setStatus(result.kind === 'error' ? 'failure' : 'success');
		} catch (e: unknown) {
			const message = e instanceof Error ? e.message : String(e);
			const result: CellResult = { kind: 'error', message };
			updateCell(cellData.id, { ...cellData, result } as CellData);
			setStatus('failure');
		} finally {
			setIsLoading(false);
		}
	}, [cellData, execute, updateCell]);

	return { isLoading, status, run };
}
