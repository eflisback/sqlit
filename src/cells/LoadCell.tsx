import type { LoadCellData } from '@/store/types';
import { CellOutput } from './CellOutput';
import styles from './cells.module.css';

export const LoadCell = ({ cellData }: { cellData: LoadCellData }) => (
	<>
		<span className={styles.urlInput}>{cellData.url}</span>
		<CellOutput result={cellData.result} />
	</>
);
