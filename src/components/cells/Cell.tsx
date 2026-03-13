import type { CellData } from '../../store';
import styles from './cells.module.css';
import { MarkdownCell } from './MarkdownCell';
import { SQLCell } from './SQLCell';

interface CellProps {
	cellData: CellData;
}

export const Cell = ({ cellData }: CellProps) => {
	return (
		<article className={styles.cell}>
			{cellData.type === 'markdown' ? (
				<MarkdownCell cellData={cellData} />
			) : (
				<SQLCell cellData={cellData} />
			)}
		</article>
	);
};
