import { FaMarkdown } from 'react-icons/fa6';
import Markdown from 'react-markdown';
import type { MarkdownCellData } from '@/store/types';
import { CellShell } from './CellShell';

export const MarkdownCell = ({
	cellData,
	isFirst,
	isLast,
}: {
	cellData: MarkdownCellData;
	isFirst: boolean;
	isLast: boolean;
}) => (
	<CellShell
		Icon={FaMarkdown}
		label='info'
		information='Used for displaying information to the user.'
		cellId={cellData.id}
		isFirst={isFirst}
		isLast={isLast}
	>
		<Markdown>{cellData.content}</Markdown>
	</CellShell>
);
