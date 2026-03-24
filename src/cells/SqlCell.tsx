import { sql } from '@codemirror/lang-sql';
import CodeMirror from '@uiw/react-codemirror';
import { useTheme } from '@/components';
import { useSheetStore } from '@/store';
import type { SqlCellData } from '@/store/types';
import { CellOutput } from './CellOutput';
import { useDebouncedCallback } from './useDebouncedCallback';

export const SqlCell = ({ cellData }: { cellData: SqlCellData }) => {
	const updateCell = useSheetStore((state) => state.updateCell);
	const anyRunning = useSheetStore((state) => state.runningCellId !== null);
	const { theme } = useTheme();
	const handleChange = useDebouncedCallback(
		(code: string) => updateCell(cellData.id, { ...cellData, content: code }),
		250,
	);

	return (
		<>
			<CodeMirror
				basicSetup={{ autocompletion: false }}
				theme={theme}
				value={cellData.content}
				editable={!anyRunning}
				extensions={[sql()]}
				onChange={handleChange}
			/>
			<CellOutput result={cellData.result} />
		</>
	);
};
