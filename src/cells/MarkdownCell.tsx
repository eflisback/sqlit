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
import styles from './cells.module.css';
import { useDebouncedCallback } from './useDebouncedCallback';

export const MarkdownCell = ({
	cellData,
	isFirst,
	isLast,
}: {
	cellData: MarkdownCellData;
	isFirst: boolean;
	isLast: boolean;
}) => {
	const isEditable = useSheetStore((state) => state.isEditable);
	const updateCell = useSheetStore((state) => state.updateCell);
	const { theme } = useTheme();
	const handleChange = useDebouncedCallback(
		(code: string) => updateCell(cellData.id, { ...cellData, content: code }),
		150,
	);

	return (
		<CellShell
			Icon={FaMarkdown}
			label='info'
			information='Used for displaying information to the user.'
			cellId={cellData.id}
			isFirst={isFirst}
			isLast={isLast}
		>
			<CodeMirror
				className={isEditable ? undefined : styles.hidden}
				basicSetup={{ autocompletion: false, lineNumbers: false }}
				theme={theme}
				value={cellData.content}
				extensions={[markdown(), EditorView.lineWrapping]}
				onChange={handleChange}
			/>
			<div className={`${styles.markdownContent}${isEditable ? ` ${styles.hidden}` : ''}`}>
				<Markdown remarkPlugins={[remarkGfm]}>{cellData.content}</Markdown>
			</div>
		</CellShell>
	);
};
