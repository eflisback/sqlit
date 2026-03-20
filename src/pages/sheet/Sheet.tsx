import { Fragment } from 'react';
import { Cell } from '@/components';
import { CellInserter } from '@/components/cell-inserter/CellInserter';
import { useSheetStore } from '@/store';
import { Header } from './Header';
import styles from './Sheet.module.css';

export const Sheet = () => {
	const cells = useSheetStore((state) => state.cells);

	return (
		<>
			<Header />
			<main className={styles.sheet}>
				<CellInserter index={0} />
				{cells.map((cellData, i) => (
					<Fragment key={cellData.id}>
						<Cell
							cellData={cellData}
							isFirst={i === 0}
							isLast={i === cells.length - 1}
						/>
						<CellInserter index={i + 1} />
					</Fragment>
				))}
			</main>
		</>
	);
};
