import { MdDelete, MdInfo, MdStorage } from 'react-icons/md';
import { type CellData, useNotebookStore } from '@/store';
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
	const removeCell = useNotebookStore((state) => state.removeCell);
	const editable = useNotebookStore((state) => state.editable);
	const { Icon, label } = CELL_META[cellData.type];

	const handleDeleteButtonClick = () => {
		removeCell(cellData.id);
	};

	return (
		<article className={styles.cell}>
			<header>
				<section>
					<Icon />
					<span>{label}</span>
				</section>
				<section>
					{editable && (
						<button type='button' onClick={handleDeleteButtonClick}>
							<MdDelete />
						</button>
					)}
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
