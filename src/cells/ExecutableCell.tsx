import type { IconType } from 'react-icons';
import {
	FaDatabase,
	FaFileImport,
	FaForward,
	FaPlay,
	FaPython,
} from 'react-icons/fa6';
import type { ExecutableCellData } from '@/store/types';
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
		Icon: FaFileImport,
		label: 'load',
		information:
			'Loads existing SQLite database files into the in-memory SQLite database.',
	},
};

interface ExecutableCellProps {
	cellData: ExecutableCellData;
	isFirst: boolean;
	isLast: boolean;
}

export const ExecutableCell = ({
	cellData,
	isFirst,
	isLast,
}: ExecutableCellProps) => {
	const { Icon, label, information } = cellMeta[cellData.type];
	const { isLoading, anyRunning, status, run, runWithPrior, showRunWithPrior } =
		useRunCell(cellData);

	return (
		<CellShell
			Icon={Icon}
			label={label}
			information={information}
			cellId={cellData.id}
			isFirst={isFirst}
			isLast={isLast}
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
	);
};
