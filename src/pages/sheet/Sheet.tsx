import { Cell } from '@/components';
import { CellInserter } from '@/components/cell-inserter/CellInserter';
import { useSheetStore } from '@/store';
import { Header } from './Header';
import styles from './Sheet.module.css';

export const Sheet = () => {
	const cells = useSheetStore((state) => state.cells);
	const isEditable = useSheetStore((state) => state.isEditable);

	return (
		<>
			<Header />
			<main className={styles.sheet}>
				{isEditable && <CellInserter index={0} />}
				{cells.map((cellData, i) => (
					<>
						<Cell
							key={cellData.id}
							cellData={cellData}
							isFirst={i === 0}
							isLast={i === cells.length - 1}
						/>
						{isEditable && <CellInserter index={i + 1} />}
					</>
				))}
			</main>
		</>
	);
};
