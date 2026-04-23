import Link from 'next/link';
import type { SheetConfig } from '@/lib';
import styles from './sheet-cards.module.css';

export function sheetHref(sheet: SheetConfig, localIndex: number): string {
	if (sheet.gistId) return `/sheet?gist=${sheet.gistId}`;
	if (sheet.fileUrl) return `/sheet?url=${encodeURIComponent(sheet.fileUrl)}`;
	if (sheet.markdown) return `/sheet?local=${localIndex}`;
	throw new Error('Sheet was configured with no gistId, fileUrl, or markdown.');
}

interface SheetCardProps {
	index: number;
	localIndex: number;
	sheet: SheetConfig;
}

export function SheetCard({ index, localIndex, sheet }: SheetCardProps) {
	return (
		<Link href={sheetHref(sheet, localIndex)} className={styles.card}>
			<span className={styles.cardHeader}>
				<span className={styles.badge}>{index}</span>
				<span className={styles.cardName}>{sheet.name}</span>
			</span>
			<span className={styles.cardDescription} title={sheet.description}>
				{sheet.description}
			</span>
		</Link>
	);
}
