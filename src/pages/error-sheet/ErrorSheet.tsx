import styles from './ErrorSheet.module.css';

interface Props {
	error: string;
	onContinue: () => void;
}

export const ErrorSheet = ({ error, onContinue }: Props) => (
	<div className={styles.container}>
		<div className={styles.logo}>
			<img src='/logo.svg' alt='sqlit logo' />
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
