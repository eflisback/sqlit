import type { LoadCellData } from '@/store/types';
import { useSheetStore } from '@/store/useSheetStore';
import { CellOutput } from './CellOutput';
import styles from './cells.module.css';

export const LoadCell = ({ cellData }: { cellData: LoadCellData }) => {
	const editableCellId = useSheetStore((state) => state.editableCellId);
	const updateCell = useSheetStore((state) => state.updateCell);

	const isEditable = editableCellId === cellData.id;

	return (
		<>
			<input
				className={styles.urlInput}
				type='text'
				value={cellData.url}
				placeholder='https://example.com/database.sqlite'
				disabled={!isEditable}
				onChange={(e) =>
					updateCell(cellData.id, { ...cellData, url: e.target.value })
				}
			/>

			<CellOutput result={cellData.result} />
		</>
	);
};
