import type { LoadCellData } from '@/store/types';
import { useSheetStore } from '@/store/useSheetStore';
import { CellOutput } from './CellOutput';
import styles from './cells.module.css';

export const LoadCell = ({ cellData }: { cellData: LoadCellData }) => {
	const isEditable = useSheetStore((s) => s.isEditable);
	const updateCell = useSheetStore((s) => s.updateCell);

	return (
		<>
			{isEditable ? (
				<input
					className={styles.urlInput}
					type='text'
					value={cellData.url}
					placeholder='https://example.com/database.sqlite'
					onChange={(e) =>
						updateCell(cellData.id, { ...cellData, url: e.target.value })
					}
				/>
			) : (
				<span className={styles.urlInput}>{cellData.url || 'No URL'}</span>
			)}
			<CellOutput result={cellData.result} />
		</>
	);
};
