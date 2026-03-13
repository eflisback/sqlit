import Markdown from 'react-markdown';
import type { CellData } from '@/store';

interface MarkdownCellProps {
	cellData: Extract<CellData, { type: 'markdown' }>;
}

export const MarkdownCell = ({ cellData }: MarkdownCellProps) => {
	return <Markdown>{cellData.content}</Markdown>;
};
