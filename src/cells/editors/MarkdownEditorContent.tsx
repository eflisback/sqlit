import Markdown from 'react-markdown';
import type { CellData } from '@/store/types';
import type { EditorProps } from '../types';

type MarkdownCell = Extract<CellData, { type: 'markdown' }>;

export const MarkdownEditorContent = ({
	cellData,
}: EditorProps<MarkdownCell>) => {
	return <Markdown>{cellData.content}</Markdown>;
};
