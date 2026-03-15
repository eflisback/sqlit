import { Cell } from '@/components';
import { useSheetStore } from '@/store';
import { Header } from './Header';
import styles from './Sheet.module.css';

export const Sheet = () => {
	const cells = useSheetStore((state) => state.cells);

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
