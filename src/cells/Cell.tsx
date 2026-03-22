import { memo } from 'react';
import { type CellData, isExecutableCellData } from '@/store/types';
import { ExecutableCell } from './ExecutableCell';
import { MarkdownCell } from './MarkdownCell';

interface CellProps {
	cellData: CellData;
}

export const Cell = memo(({ cellData }: CellProps) => {
	if (isExecutableCellData(cellData))
		return <ExecutableCell cellData={cellData} />;
	return <MarkdownCell cellData={cellData} />;
});
