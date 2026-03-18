import type { CellResult } from '@/store/types';
import styles from './cells.module.css';

interface CellOutputProps {
	result: CellResult | null | undefined;
}

export const CellOutput = ({ result }: CellOutputProps) => {
	if (!result) return null;

	switch (result.kind) {
		case 'table':
			return (
				<section className={styles.result}>
					{result.rows.length > 0 ? (
						<table className={styles.resultTable}>
							<thead>
								<tr>
									{Object.keys(result.rows[0]).map((col) => (
										<th key={col}>{col}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{result.rows.map((row, i) => (
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
							{result.rowsAffected > 0
								? `Query OK (${result.rowsAffected} change${result.rowsAffected > 1 ? 's' : ''} applied)`
								: 'Query OK'}
						</p>
					)}
				</section>
			);
		case 'text':
			return <p className={styles.status}>{result.text}</p>;
		case 'error':
			return <section className={styles.error}>{result.message}</section>;
	}
};
