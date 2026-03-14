import { sql } from '@codemirror/lang-sql';
import CodeMirror from '@uiw/react-codemirror';
import { useState } from 'react';
import { FaPlay } from 'react-icons/fa6';
import { engine } from '@/engine';
import { type CellData, useNotebookStore } from '@/store';
import { useTheme } from '@/components';
import styles from './cells.module.css';

interface SQLCellProps {
	cellData: Extract<CellData, { type: 'sql' }>;
	setCellStatus: (status: 'none' | 'success' | 'failure') => void;
}

export const SQLCell = ({ cellData, setCellStatus }: SQLCellProps) => {
	const updateCell = useNotebookStore((state) => state.updateCell);
	const [error, setError] = useState<string | null>(null);
	const { theme } = useTheme();

	const handleExecuteClick = async () => {
		try {
			const result = await engine.query(cellData.content);
			updateCell(cellData.id, { ...cellData, result });
			setError(null);
			setCellStatus('success');
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : String(e));
			updateCell(cellData.id, { ...cellData, result: null });
			setCellStatus('failure');
		}
	};

	return (
		<>
			<CodeMirror
				className={styles.editor}
				basicSetup={{ autocompletion: false }}
				theme={theme}
				value={cellData.content}
				extensions={[sql()]}
				onChange={(code) =>
					updateCell(cellData.id, { ...cellData, content: code })
				}
			/>
			<section className={styles.actions}>
				<button type='button' onClick={handleExecuteClick}>
					<FaPlay />
					<span>Run code block</span>
				</button>
			</section>
			{cellData.result && (
				<section className={styles.result}>
					{cellData.result.rows.length > 0 ? (
						<table className={styles.resultTable}>
							<thead>
								<tr>
									{Object.keys(cellData.result.rows[0]).map((col) => (
										<th key={col}>{col}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{cellData.result.rows.map((row, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: No stable key available
									<tr key={i}>
										{Object.values(row).map((val, j) => (
											// biome-ignore lint/suspicious/noArrayIndexKey: Positional
											<td key={j}>{String(val ?? '')}</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p className={styles.status}>
							{cellData.result.rowsAffected > 0
								? `Query OK (${cellData.result.rowsAffected} change${cellData.result.rowsAffected > 1 ? 's' : ''} applied)`
								: 'Query OK'}
						</p>
					)}
				</section>
			)}
			{error && <section className={styles.error}>{error}</section>}
		</>
	);
};
