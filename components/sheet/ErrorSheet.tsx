'use client';

import Image from 'next/image';
import styles from './ErrorSheet.module.css';

interface Props {
	error: string;
	onContinue: () => void;
}

export const ErrorSheet = ({ error, onContinue }: Props) => (
	<div className={styles.container}>
		<div className={styles.logo}>
			<Image src='/logo.svg' alt='sqlit logo' width={32} height={32} />
			<span className={styles.logoText}>sqlit</span>
		</div>
		<p className={styles.error}>{error}</p>
		<button
			type='button'
			className={styles.continueButton}
			onClick={onContinue}
		>
			Continue anyway
		</button>
	</div>
);
