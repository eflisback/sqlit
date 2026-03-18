import type { CellData } from '@/store/types';
import { LoadCell } from './LoadCell';
import { MarkdownCell } from './MarkdownCell';
import { PythonCell } from './PythonCell';
import { SqlCell } from './SqlCell';

export const Cell = ({ cellData }: { cellData: CellData }) => {
	switch (cellData.type) {
		case 'sql':
			return <SqlCell cellData={cellData} />;
		case 'python':
			return <PythonCell cellData={cellData} />;
		case 'markdown':
			return <MarkdownCell cellData={cellData} />;
		case 'load':
			return <LoadCell cellData={cellData} />;
	}
};
