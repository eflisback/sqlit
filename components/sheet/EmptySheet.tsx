'use client';

import {
	FaDatabase,
	FaFileArrowDown,
	FaMarkdown,
	FaPython,
} from 'react-icons/fa6';
import { InsertCellCommand } from '@/lib/store/commands';
import { history } from '@/lib/store';
import styles from './EmptySheet.module.css';

export const EmptySheet = () => {
	const addSql = () =>
		history.execute(
			new InsertCellCommand(
				{ id: crypto.randomUUID(), type: 'sql', content: '', result: null },
				0,
			),
		);
	const addPython = () =>
		history.execute(
			new InsertCellCommand(
				{ id: crypto.randomUUID(), type: 'python', content: '', result: null },
				0,
			),
		);
	const addMarkdown = () =>
		history.execute(
			new InsertCellCommand(
				{ id: crypto.randomUUID(), type: 'markdown', content: '' },
				0,
			),
		);
	const addLoad = () =>
		history.execute(
			new InsertCellCommand(
				{ id: crypto.randomUUID(), type: 'load', url: '', result: null },
				0,
			),
		);

	return (
		<div className={styles.emptySheet}>
			<p className={styles.heading}>Add your first cell</p>
			<p className={styles.hint}>
				(Right-click on existing cells to insert more in the future)
			</p>
			<div className={styles.buttons}>
				<button type='button' onClick={addSql}>
					<FaDatabase />
					SQL
				</button>
				<button type='button' onClick={addPython}>
					<FaPython />
					Python
				</button>
				<button type='button' onClick={addMarkdown}>
					<FaMarkdown />
					Markdown
				</button>
				<button type='button' onClick={addLoad}>
					<FaFileArrowDown />
					Load
				</button>
			</div>
		</div>
	);
};
