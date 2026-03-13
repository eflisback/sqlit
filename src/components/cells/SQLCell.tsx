import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import type { CellData } from '@/store';

interface SQLCellProps {
	cellData: Extract<CellData, { type: 'sql' }>;
}

export const SQLCell = ({ cellData }: SQLCellProps) => {
	return (
		<>
			<pre>
				<SyntaxHighlighter language='sql' style={docco}>
					{cellData.content}
				</SyntaxHighlighter>
			</pre>
			<footer>Bruh</footer>
		</>
	);
};
