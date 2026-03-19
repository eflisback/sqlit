import {
	FaDatabase,
	FaFileImport,
	FaMarkdown,
	FaPython,
} from 'react-icons/fa6';
import { useSheetStore } from '@/store/useSheetStore';
import styles from './CellInserter.module.css';

interface CellInserterProps {
	index: number;
}

export const CellInserter = ({ index }: CellInserterProps) => {
	const insertCell = useSheetStore((s) => s.insertCell);

	const insert = (type: 'markdown' | 'sql' | 'python' | 'load') => {
		const id = crypto.randomUUID();
		if (type === 'markdown') {
			insertCell({ id, type, content: '# Hello, world!' }, index);
		} else if (type === 'sql') {
			insertCell(
				{
					id,
					type,
					content: 'SELECT sqlite_version() as version',
					result: null,
				},
				index,
			);
		} else if (type === 'python') {
			insertCell(
				{ id, type, content: `print("Hello, world!")`, result: null },
				index,
			);
		} else {
			insertCell(
				{ id, type, url: 'https://example.com/database.sqlite', result: null },
				index,
			);
		}
	};

	return (
		<div className={styles.cellInserter}>
			<div className={styles.insertButtons}>
				Insert a new...
				<button type='button' onClick={() => insert('markdown')}>
					<FaMarkdown />
					<span>Markdown cell</span>
				</button>
				<button type='button' onClick={() => insert('sql')}>
					<FaDatabase />
					<span>SQL Cell</span>
				</button>
				<button type='button' onClick={() => insert('python')}>
					<FaPython />
					<span>Python cell</span>
				</button>
				<button type='button' onClick={() => insert('load')}>
					<FaFileImport />
					<span>Load cell</span>
				</button>
			</div>
		</div>
	);
};
