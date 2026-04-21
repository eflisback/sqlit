'use client';

import Link from 'next/link';
import type { IconType } from 'react-icons';
import { FaPlus, FaRotateLeft } from 'react-icons/fa6';
import { useSheetStore } from '@/lib/store';
import type { SheetCategory, SheetConfig } from '@/lib/types/config';
import styles from './SheetList.module.css';

interface Props {
	categories: SheetCategory[];
}

function sheetHref(sheet: SheetConfig): string {
	if (sheet.gistId) return `/sheet?gist=${sheet.gistId}`;
	if (sheet.fileUrl) return `/sheet?url=${encodeURIComponent(sheet.fileUrl)}`;
	throw new Error('Sheet was configured with no gistId or fileUrl.');
}

function sheetKey(sheet: SheetConfig): string {
	if (sheet.gistId) return sheet.gistId;
	if (sheet.fileUrl) return sheet.fileUrl;
	throw new Error('Sheet was configured with no gistId or fileUrl.');
}

interface QuickCardProps {
	icon: IconType;
	href: string;
	name: string;
	description: string;
	disabled?: boolean;
}

function QuickCard({
	icon: Icon,
	href,
	name,
	description,
	disabled,
}: QuickCardProps) {
	const className = `${styles.quickCard}${disabled ? ` ${styles.cardDisabled}` : ''}`;

	const inner = (
		<>
			<span className={styles.quickBadge}>
				<Icon />
			</span>
			<span className={styles.quickCardText}>
				<span className={styles.cardName}>{name}</span>
				<span className={styles.cardDescription}>{description}</span>
			</span>
		</>
	);

	if (disabled) {
		return (
			<div
				className={className}
				aria-disabled='true'
				title='Open a sheet first to resume it'
			>
				{inner}
			</div>
		);
	}

	return (
		<Link href={href} className={className}>
			{inner}
		</Link>
	);
}

interface SheetCardProps {
	index: number;
	sheet: SheetConfig;
}

function SheetCard({ index, sheet }: SheetCardProps) {
	return (
		<Link href={sheetHref(sheet)} className={styles.card}>
			<span className={styles.cardHeader}>
				<span className={styles.badge}>{index}</span>
				<span className={styles.cardName}>{sheet.name}</span>
			</span>
			<span className={styles.cardDescription}>{sheet.description}</span>
		</Link>
	);
}

export function SheetList({ categories }: Props) {
	const hasCells = useSheetStore((state) => state.cells.length > 0);

	return (
		<div className={styles.root}>
			<section>
				<p className={styles.sectionLabel}>Quick Start</p>
				<div className={styles.quickGrid}>
					<QuickCard
						icon={FaPlus}
						href='/sheet?blank'
						name='Create blank sheet'
						description='Start with a fresh, empty sheet'
					/>
					<QuickCard
						icon={FaRotateLeft}
						href='/sheet'
						name='Resume'
						description='Continue where you left off'
						disabled={!hasCells}
					/>
				</div>
			</section>
			{categories.map((category) => (
				<section key={category.name}>
					<p className={styles.sectionLabel}>{category.name}</p>
					<div className={styles.grid}>
						{category.sheets.map((sheet, i) => (
							<SheetCard key={sheetKey(sheet)} index={i + 1} sheet={sheet} />
						))}
					</div>
				</section>
			))}
		</div>
	);
}
