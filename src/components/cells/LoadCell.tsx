import { useState } from 'react';
import { FaUpload } from 'react-icons/fa6';
import { engine } from '@/engine';
import type { CellData } from '@/store';
import styles from './cells.module.css';

interface LoadCellProps {
	cellData: Extract<CellData, { type: 'load' }>;
	setCellStatus: (status: 'none' | 'success' | 'failure') => void;
}

export const LoadCell = ({ cellData, setCellStatus }: LoadCellProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loaded, setLoaded] = useState(false);

	const handleLoadClick = async () => {
		setIsLoading(true);
		setError(null);
		setLoaded(false);
		try {
			await engine.loadFromUrl(cellData.url);
			setLoaded(true);
			setCellStatus('success');
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
			setCellStatus('failure');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<span className={styles.urlInput}>{cellData.url}</span>
			<section className={styles.actions}>
				<button
					type='button'
					onClick={handleLoadClick}
					disabled={isLoading || !cellData.url}
				>
					<FaUpload />
					<span>{isLoading ? 'Loading…' : 'Load database'}</span>
				</button>
			</section>
			{loaded && !error && (
				<p className={styles.status}>Database loaded successfully.</p>
			)}
			{error && <section className={styles.error}>{error}</section>}
		</>
	);
};
