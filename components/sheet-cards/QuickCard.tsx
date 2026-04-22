import Link from 'next/link';
import type { IconType } from 'react-icons';
import styles from './sheet-cards.module.css';

export interface QuickCardProps {
	icon: IconType;
	href: string;
	name: string;
	description: string;
	disabled?: boolean;
}

export function QuickCard({
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
				title='No saved work yet.'
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
