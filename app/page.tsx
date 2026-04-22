import { FaPlus } from 'react-icons/fa6';
import { QuickCard, ResumeCard, SheetCard, sheetKey } from '@/components';
import config from '@/sqlit.config';
import styles from './page.module.css';
import listStyles from '@/components/sheet-cards/sheet-cards.module.css';

export default function HomePage() {
	return (
		<main className={styles.page}>
			<div className={listStyles.root}>
				<section>
					<p className={listStyles.sectionLabel}>Quick Start</p>
					<div className={listStyles.quickGrid}>
						<QuickCard
							icon={FaPlus}
							href='/sheet?blank'
							name='Create blank sheet'
							description='Start with a fresh, empty sheet'
						/>
						<ResumeCard />
					</div>
				</section>
				{config.categories.map((category) => (
					<section key={category.name}>
						<p className={listStyles.sectionLabel}>{category.name}</p>
						<div className={listStyles.grid}>
							{category.sheets.map((sheet, i) => (
								<SheetCard key={sheetKey(sheet)} index={i + 1} sheet={sheet} />
							))}
						</div>
					</section>
				))}
			</div>
		</main>
	);
}
