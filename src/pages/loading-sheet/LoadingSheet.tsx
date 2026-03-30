import styles from './LoadingSheet.module.css';

export const LoadingSheet = () => (
	<div className={styles.container}>
		<div className={styles.logo}>
			<img src='/logo.svg' alt='sqlit logo' />
			<span className={styles.logoText}>sqlit</span>
		</div>
		<p className={styles.subtitle}>Loading shared sheet…</p>
	</div>
);
