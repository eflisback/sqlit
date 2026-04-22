'use client';

import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import { FaMarkdown } from 'react-icons/fa6';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useColorScheme, useSheetStore } from '@/lib';
import type { MarkdownCellData } from '@/lib';
import { CellShell } from './CellShell';
import { useDebouncedCallback } from './useDebouncedCallback';

interface MarkdownCellProps {
	cellData: MarkdownCellData;
}

export const MarkdownCell = ({ cellData }: MarkdownCellProps) => {
	const editableCellId = useSheetStore((state) => state.editableCellId);
	const updateCell = useSheetStore((state) => state.updateCell);
	const scheme = useColorScheme();
	const handleChange = useDebouncedCallback(
		(code: string) => updateCell(cellData.id, { ...cellData, content: code }),
		250,
	);

	const isEditable = editableCellId === cellData.id;
	const isEmpty = !cellData.content.trim();

	return (
		<CellShell
			Icon={FaMarkdown}
			label='info'
			information='Used for displaying information to the user.'
			cellId={cellData.id}
			hideHeader={!isEmpty || isEditable}
		>
			{isEditable ? (
				<CodeMirror
					basicSetup={{ autocompletion: false, lineNumbers: false }}
					theme={scheme}
					value={cellData.content}
					extensions={[markdown(), EditorView.lineWrapping]}
					onChange={handleChange}
				/>
			) : (
				<Markdown remarkPlugins={[remarkGfm]}>{cellData.content}</Markdown>
			)}
		</CellShell>
	);
};
