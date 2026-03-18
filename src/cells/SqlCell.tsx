import { sql } from '@codemirror/lang-sql';
import CodeMirror from '@uiw/react-codemirror';
import { FaDatabase } from 'react-icons/fa6';
import { useTheme } from '@/components';
import { engine } from '@/engine';
import { useSheetStore } from '@/store';
import type { CellData } from '@/store/types';
import { CellOutput } from './CellOutput';
import { ExecutableCellShell, RunButton } from './ExecutableCellShell';
import { useRunCell } from './useRunCell';

type SqlCellData = Extract<CellData, { type: 'sql' }>;

export const SqlCell = ({ cellData }: { cellData: SqlCellData }) => {
	const updateCell = useSheetStore((state) => state.updateCell);
	const { theme } = useTheme();
	const { isLoading, status, run } = useRunCell(cellData, (data) =>
		engine.query(data.content),
	);

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
				editable={!isLoading}
				extensions={[sql()]}
				onChange={(code) =>
					updateCell(cellData.id, { ...cellData, content: code })
				}
			/>
			<RunButton isLoading={isLoading} onClick={run} />
			<CellOutput result={cellData.result} />
		</ExecutableCellShell>
	);
};
