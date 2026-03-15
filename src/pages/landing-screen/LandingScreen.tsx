import { FaFileImport, FaPlus } from 'react-icons/fa6';
import { useSheetStore } from '@/store';
import { Header } from './Header';
import styles from './LandingScreen.module.css';

export const LandingScreen = () => {
	const startSheet = useSheetStore((state) => state.startSheet);

	return (
		<div className={styles.page}>
			<Header />
			<div className={styles.content}>
				<h1>SQLiteler</h1>
				<div className={styles.actions}>
					<button
						type='button'
						className={styles.actionButton}
						onClick={startSheet}
					>
						<FaPlus />
						New Sheet
					</button>
					<button type='button' className={styles.actionButton} disabled>
						<FaFileImport />
						Import Sheet
					</button>
				</div>
			</div>
		</div>
	);
};
