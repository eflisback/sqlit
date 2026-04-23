import { FaPlus } from 'react-icons/fa6';
import { QuickCard, ResumeCard, SheetCard } from '@/components';
import { flatSheets } from '@/lib/utils/config';
import config from '@/sqlit.config';
import styles from './page.module.css';
import listStyles from '@/components/sheet-cards/sheet-cards.module.css';

export default function HomePage() {
	const allSheets = flatSheets();

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
							{category.sheets.map((sheet, i) => {
								const localIndex = allSheets.indexOf(sheet);
								return (
									<SheetCard
										key={localIndex}
										index={i + 1}
										localIndex={localIndex}
										sheet={sheet}
									/>
								);
							})}
						</div>
					</section>
				))}
			</div>
		</main>
	);
}
