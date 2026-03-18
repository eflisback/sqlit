import { FaFileImport } from 'react-icons/fa6';
import type { CellData } from '@/store/types';
import { CellOutput } from './CellOutput';
import styles from './cells.module.css';
import { ExecutableCellShell, RunButton, RunWithPriorButton } from './ExecutableCellShell';
import { useRunCell } from './useRunCell';

type LoadCellData = Extract<CellData, { type: 'load' }>;

export const LoadCell = ({ cellData }: { cellData: LoadCellData }) => {
	const { isLoading, anyRunning, status, run, runWithPrior, showRunWithPrior } =
		useRunCell(cellData);

	return (
		<ExecutableCellShell
			Icon={FaFileImport}
			label='load'
			information='Loads existing SQLite database files into the in-memory SQLite database.'
			isLoading={isLoading}
			status={status}
		>
			<span className={styles.urlInput}>{cellData.url}</span>
			<section className={styles.actions}>
				<RunButton isLoading={isLoading} disabled={anyRunning} onClick={run} />
				{showRunWithPrior && (
					<RunWithPriorButton disabled={anyRunning} onClick={runWithPrior} />
				)}
			</section>
			<CellOutput result={cellData.result} />
		</ExecutableCellShell>
	);
};
