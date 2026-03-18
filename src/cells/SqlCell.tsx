import { sql } from '@codemirror/lang-sql';
import CodeMirror from '@uiw/react-codemirror';
import { FaDatabase } from 'react-icons/fa6';
import { useTheme } from '@/components';
import { useSheetStore } from '@/store';
import type { CellData } from '@/store/types';
import { CellOutput } from './CellOutput';
import styles from './cells.module.css';
import { ExecutableCellShell, RunButton, RunWithPriorButton } from './ExecutableCellShell';
import { useRunCell } from './useRunCell';

type SqlCellData = Extract<CellData, { type: 'sql' }>;

export const SqlCell = ({ cellData }: { cellData: SqlCellData }) => {
	const updateCell = useSheetStore((state) => state.updateCell);
	const { theme } = useTheme();
	const { isLoading, anyRunning, status, run, runWithPrior, showRunWithPrior } =
		useRunCell(cellData);

	return (
		<ExecutableCellShell
			Icon={FaDatabase}
			label='sql'
			information='Contains code which can be executed on the SQLite database.'
			isLoading={isLoading}
			status={status}
		>
			<CodeMirror
				basicSetup={{ autocompletion: false }}
				theme={theme}
				value={cellData.content}
				editable={!anyRunning}
				extensions={[sql()]}
				onChange={(code) =>
					updateCell(cellData.id, { ...cellData, content: code })
				}
			/>
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
