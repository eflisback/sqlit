import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import { FaMarkdown } from 'react-icons/fa6';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '@/components';
import { useSheetStore } from '@/store';
import type { MarkdownCellData } from '@/store/types';
import { CellShell } from './CellShell';
import { proxyUrl } from './proxyUrl';
import { useDebouncedCallback } from './useDebouncedCallback';

interface MarkdownCellProps {
	cellData: MarkdownCellData;
}

export const MarkdownCell = ({ cellData }: MarkdownCellProps) => {
	const editableCellId = useSheetStore((state) => state.editableCellId);
	const updateCell = useSheetStore((state) => state.updateCell);
	const { theme } = useTheme();
	const handleChange = useDebouncedCallback(
		(code: string) => updateCell(cellData.id, { ...cellData, content: code }),
		150,
	);

	const isEditable = editableCellId === cellData.id;

	return (
		<CellShell
			Icon={FaMarkdown}
			label='info'
			information='Used for displaying information to the user.'
			cellId={cellData.id}
		>
			{isEditable ? (
				<CodeMirror
					basicSetup={{ autocompletion: false, lineNumbers: false }}
					theme={theme}
					value={cellData.content}
					extensions={[markdown(), EditorView.lineWrapping]}
					onChange={handleChange}
				/>
			) : (
				<Markdown remarkPlugins={[remarkGfm]} urlTransform={proxyUrl}>
					{cellData.content}
				</Markdown>
			)}
		</CellShell>
	);
};
