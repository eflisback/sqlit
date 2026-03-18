import { FaMarkdown } from 'react-icons/fa6';
import Markdown from 'react-markdown';
import type { CellData } from '@/store/types';
import { CellShell } from './CellShell';

type MarkdownCellData = Extract<CellData, { type: 'markdown' }>;

export const MarkdownCell = ({ cellData }: { cellData: MarkdownCellData }) => (
	<CellShell
		Icon={FaMarkdown}
		label='info'
		information='Used for displaying information to the user.'
	>
		<Markdown>{cellData.content}</Markdown>
	</CellShell>
);
