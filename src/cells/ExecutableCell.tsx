import { useEffect, useRef } from 'react';
import type { IconType } from 'react-icons';
import {
	FaDatabase,
	FaFileArrowDown,
	FaForward,
	FaPlay,
	FaPython,
} from 'react-icons/fa6';
import type { ExecutableCellData } from '@/store/types';
import { useSheetStore } from '@/store/useSheetStore';
import { CellShell } from './CellShell';
import styles from './cells.module.css';
import { LoadCell } from './LoadCell';
import { PythonCell } from './PythonCell';
import { SqlCell } from './SqlCell';
import { useRunCell } from './useRunCell';

const cellMeta: Record<
	ExecutableCellData['type'],
	{ Icon: IconType; label: string; information: string }
> = {
	sql: {
		Icon: FaDatabase,
		label: 'sql',
		information: 'Contains code which can be executed on the SQLite database.',
	},
	python: {
		Icon: FaPython,
		label: 'python',
		information:
			'Contains Python code executed via Pyodide with access to the SQLite database.',
	},
	load: {
		Icon: FaFileArrowDown,
		label: 'load',
		information:
			'Loads existing SQLite database files into the in-memory SQLite database.',
	},
};

interface ExecutableCellProps {
	cellData: ExecutableCellData;
}

export const ExecutableCell = ({ cellData }: ExecutableCellProps) => {
	const { Icon, label, information } = cellMeta[cellData.type];
	const { isLoading, anyRunning, status, run, runWithPrior, showRunWithPrior } =
		useRunCell(cellData);
	const ref = useRef<HTMLDivElement>(null);
	const runningCellId = useSheetStore((state) => state.runningCellId);

	useEffect(() => {
		if (runningCellId === cellData.id) {
			ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	}, [runningCellId, cellData.id]);

	return (
		<div ref={ref}>
			<CellShell
				Icon={Icon}
				label={label}
				information={information}
				cellId={cellData.id}
				isLoading={isLoading}
				status={status}
			>
				{cellData.type === 'sql' && <SqlCell cellData={cellData} />}
				{cellData.type === 'python' && <PythonCell cellData={cellData} />}
				{cellData.type === 'load' && <LoadCell cellData={cellData} />}
				<section className={styles.actions}>
					<button type='button' onClick={run} disabled={anyRunning}>
						<FaPlay />
						<span className={isLoading ? styles.shimmer : undefined}>
							{isLoading ? 'Running...' : 'Run cell'}
						</span>
					</button>
					{showRunWithPrior && (
						<button type='button' onClick={runWithPrior} disabled={anyRunning}>
							<FaForward />
							<span>Run to here</span>
						</button>
					)}
				</section>
			</CellShell>
		</div>
	);
};
