import { MdDelete, MdInfo, MdStorage } from 'react-icons/md';
import type { CellData } from '@/store';
import styles from './cells.module.css';
import { MarkdownCell } from './MarkdownCell';
import { SQLCell } from './SQLCell';

const CELL_META = {
	markdown: { Icon: MdInfo, label: 'info' },
	sql: { Icon: MdStorage, label: 'sql' },
};

interface CellProps {
	cellData: CellData;
}

export const Cell = ({ cellData }: CellProps) => {
	const { Icon, label } = CELL_META[cellData.type];

	return (
		<article className={styles.cell}>
			<header>
				<section>
					<Icon />
					<span>{label}</span>
				</section>
				<section>
					<button type='button'>
						<MdDelete />
					</button>
				</section>
			</header>
			{cellData.type === 'markdown' ? (
				<MarkdownCell cellData={cellData} />
			) : (
				<SQLCell cellData={cellData} />
			)}
		</article>
	);
};
