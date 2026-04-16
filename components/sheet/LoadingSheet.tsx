'use client';

import Image from 'next/image';
import styles from './LoadingSheet.module.css';

export const LoadingSheet = () => (
	<div className={styles.container}>
		<div className={styles.logo}>
			<Image src='/logo.svg' alt='sqlit logo' width={32} height={32} />
			<span className={styles.logoText}>sqlit</span>
		</div>
		<p className={styles.subtitle}>Loading shared sheet…</p>
	</div>
);
