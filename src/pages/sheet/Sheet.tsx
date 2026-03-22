import { useKey } from 'react-use';
import { Cell } from '@/cells';
import { useSheetStore } from '@/store';
import { Header } from './Header';
import styles from './Sheet.module.css';

export const Sheet = () => {
	const cells = useSheetStore((state) => state.cells);
	const setEditableCellId = useSheetStore((state) => state.setEditalbeCellId);

	useKey('Escape', () => setEditableCellId(null));

	return (
		<>
			<Header />
			<main className={styles.sheet}>
				{cells.map((cellData) => (
					<Cell key={cellData.id} cellData={cellData} />
				))}
			</main>
		</>
	);
};
