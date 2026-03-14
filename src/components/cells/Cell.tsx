import { useState } from 'react';
import { FaDatabase, FaFileImport, FaMarkdown, FaTrash } from 'react-icons/fa6';
import { type CellData, useNotebookStore } from '@/store';
import styles from './cells.module.css';
import { LoadCell } from './LoadCell';
import { MarkdownCell } from './MarkdownCell';
import { SQLCell } from './SQLCell';

const CELL_META = {
	markdown: {
		Icon: FaMarkdown,
		label: 'info',
		information: 'Used for displaying information to the user.',
	},
	sql: {
		Icon: FaDatabase,
		label: 'sql',
		information: 'Contains code which can be executed on the SQLite database.',
	},
	load: {
		Icon: FaFileImport,
		label: 'load',
		information:
			'Can load existing SQLite database files into the SQLite database.',
	},
};

interface CellProps {
	cellData: CellData;
}

export const Cell = ({ cellData }: CellProps) => {
	const [cellStatus, setCellStatus] = useState<'none' | 'success' | 'failure'>(
		'none',
	);
	const removeCell = useNotebookStore((state) => state.removeCell);
	const editable = useNotebookStore((state) => state.editable);
	const { Icon, label, information } = CELL_META[cellData.type];

	const handleDeleteButtonClick = () => {
		removeCell(cellData.id);
	};

	return (
		<article className={`${styles.cell} ${styles[cellStatus]}`}>
			<header>
				<section title={information}>
					<Icon />
					<span>{label}</span>
				</section>
				<section>
					{editable && (
						<button type='button' onClick={handleDeleteButtonClick}>
							<FaTrash />
						</button>
					)}
				</section>
			</header>
			{cellData.type === 'markdown' ? (
				<MarkdownCell cellData={cellData} />
			) : cellData.type === 'load' ? (
				<LoadCell cellData={cellData} setCellStatus={setCellStatus} />
			) : (
				<SQLCell cellData={cellData} setCellStatus={setCellStatus} />
			)}
		</article>
	);
};
