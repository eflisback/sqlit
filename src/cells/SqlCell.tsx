import { sql } from '@codemirror/lang-sql';
import CodeMirror from '@uiw/react-codemirror';
import { useTheme } from '@/components';
import { useSheetStore } from '@/store';
import type { SqlCellData } from '@/store/types';
import { CellOutput } from './CellOutput';

export const SqlCell = ({ cellData }: { cellData: SqlCellData }) => {
	const updateCell = useSheetStore((state) => state.updateCell);
	const anyRunning = useSheetStore((state) => state.runningCellId !== null);
	const { theme } = useTheme();

	return (
		<>
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
			<CellOutput result={cellData.result} />
		</>
	);
};
