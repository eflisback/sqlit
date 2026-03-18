import { sql } from '@codemirror/lang-sql';
import CodeMirror from '@uiw/react-codemirror';
import { useTheme } from '@/components';
import type { CellData } from '@/store/types';
import type { EditorProps } from '../types';

type SqlCell = Extract<CellData, { type: 'sql' }>;

export const SqlEditorContent = ({ cellData, isLoading, onChange }: EditorProps<SqlCell>) => {
	const { theme } = useTheme();
	return (
		<CodeMirror
			basicSetup={{ autocompletion: false }}
			theme={theme}
			value={cellData.content}
			editable={!isLoading}
			extensions={[sql()]}
			onChange={(code) => onChange({ content: code })}
		/>
	);
};
