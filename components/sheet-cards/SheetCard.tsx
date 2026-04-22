import Link from 'next/link';
import type { SheetConfig } from '@/lib/types/config';
import styles from './sheet-cards.module.css';

export function sheetHref(sheet: SheetConfig): string {
	if (sheet.gistId) return `/sheet?gist=${sheet.gistId}`;
	if (sheet.fileUrl) return `/sheet?url=${encodeURIComponent(sheet.fileUrl)}`;
	throw new Error('Sheet was configured with no gistId or fileUrl.');
}

export function sheetKey(sheet: SheetConfig): string {
	if (sheet.gistId) return sheet.gistId;
	if (sheet.fileUrl) return sheet.fileUrl;
	throw new Error('Sheet was configured with no gistId or fileUrl.');
}

interface SheetCardProps {
	index: number;
	sheet: SheetConfig;
}

export function SheetCard({ index, sheet }: SheetCardProps) {
	return (
		<Link href={sheetHref(sheet)} className={styles.card}>
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
