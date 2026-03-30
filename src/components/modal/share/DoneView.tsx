import { useState } from 'react';
import styles from '../Modal.module.css';

interface Props {
	sharedUrl: string;
	onShareAgain: () => void;
}

export const DoneView = ({ sharedUrl, onShareAgain }: Props) => {
	const [copied, setCopied] = useState(false);

	async function handleCopy() {
		await navigator.clipboard.writeText(sharedUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<>
			<p className={styles.successHeading}>Shared!</p>
			<div className={styles.urlRow}>
				<input
					type='text'
					readOnly
					value={sharedUrl}
					className={styles.urlInput}
				/>
				<button
					type='button'
					className={styles.loginButton}
					onClick={handleCopy}
				>
					{copied ? 'Copied!' : 'Copy'}
				</button>
			</div>
			<button type='button' className={styles.textButton} onClick={onShareAgain}>
				Share again
			</button>
		</>
	);
};
