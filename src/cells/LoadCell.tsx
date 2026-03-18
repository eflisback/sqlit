import { FaFileImport } from 'react-icons/fa6';
import { engine } from '@/engine';
import type { CellData } from '@/store/types';
import { CellOutput } from './CellOutput';
import styles from './cells.module.css';
import { ExecutableCellShell, RunButton } from './ExecutableCellShell';
import { useRunCell } from './useRunCell';

type LoadCellData = Extract<CellData, { type: 'load' }>;

export const LoadCell = ({ cellData }: { cellData: LoadCellData }) => {
	const { isLoading, status, run } = useRunCell(cellData, async (data) => {
		await engine.loadFromUrl(data.url);
		return { kind: 'text', text: 'Database loaded successfully.' };
	});

	return (
		<ExecutableCellShell
			Icon={FaFileImport}
			label='load'
			information='Loads existing SQLite database files into the in-memory SQLite database.'
			isLoading={isLoading}
			status={status}
		>
			<span className={styles.urlInput}>{cellData.url}</span>
			<RunButton isLoading={isLoading} onClick={run} />
			<CellOutput result={cellData.result} />
		</ExecutableCellShell>
	);
};
