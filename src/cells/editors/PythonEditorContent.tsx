import { python } from '@codemirror/lang-python';
import CodeMirror from '@uiw/react-codemirror';
import { useTheme } from '@/components';
import type { CellData } from '@/store/types';
import type { EditorProps } from '../types';

type PythonCell = Extract<CellData, { type: 'python' }>;

export const PythonEditorContent = ({
	cellData,
	isLoading,
	onChange,
}: EditorProps<PythonCell>) => {
	const { theme } = useTheme();
	return (
		<CodeMirror
			basicSetup={{ autocompletion: false }}
			theme={theme}
			value={cellData.content}
			editable={!isLoading}
			extensions={[python()]}
			onChange={(code) => onChange({ content: code })}
		/>
	);
};
