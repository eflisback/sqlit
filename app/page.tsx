import { SheetList } from '@/components/sheet-list/SheetList';
import config from '@/sqlit.config';
import styles from './page.module.css';

export default function HomePage() {
	return (
		<main className={styles.page}>
			<SheetList categories={config.categories} />
		</main>
	);
}
