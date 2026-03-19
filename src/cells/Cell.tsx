import { type CellData, isExecutableCellData } from '@/store/types';
import { ExecutableCell } from './ExecutableCell';
import { MarkdownCell } from './MarkdownCell';

interface CellProps {
	cellData: CellData;
	isFirst: boolean;
	isLast: boolean;
}

export const Cell = ({ cellData, isFirst, isLast }: CellProps) => {
	if (isExecutableCellData(cellData))
		return (
			<ExecutableCell cellData={cellData} isFirst={isFirst} isLast={isLast} />
		);
	return <MarkdownCell cellData={cellData} isFirst={isFirst} isLast={isLast} />;
};
