import Link from 'next/link';
import { SheetList } from '@/components/home/SheetList';
import config from '@/sqlit.config';
import styles from './page.module.css';

export default function HomePage() {
	return (
		<main className={styles.page}>
			<SheetList sheets={config.sheets} />
			<Link href='/sheet'>Open blank sheet</Link>
		</main>
	);
}
