import { useCallback, useState } from 'react';
import { useSheetStore } from '@/store';
import type { CellData, CellResult } from '@/store/types';
import type { CellDefinition, CellStatus } from './types';

interface RunCellState {
	isLoading: boolean;
	status: CellStatus;
	run: () => Promise<void>;
}

export function useRunCell<T extends CellData>(
	cellData: T,
	definition: CellDefinition<T>,
): RunCellState {
	const updateCell = useSheetStore((state) => state.updateCell);
	const [isLoading, setIsLoading] = useState(false);
	const [status, setStatus] = useState<CellStatus>('none');

	const run = useCallback(async () => {
		if (!definition.execute) return;

		setIsLoading(true);
		try {
			const result = await definition.execute(cellData);
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
	}, [cellData, definition, updateCell]);

	return { isLoading, status, run };
}
