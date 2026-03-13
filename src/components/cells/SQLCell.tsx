import type { CellData } from '../../store';

interface SQLCellProps {
	cellData: Extract<CellData, { type: 'sql' }>;
}

export const SQLCell = ({ cellData }: SQLCellProps) => {
	return <div>{cellData.content}</div>;
};
