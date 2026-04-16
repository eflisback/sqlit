'use client';

import { useState } from 'react';
import { FaCopy } from 'react-icons/fa6';
import styles from '../Modal.module.css';

interface Props {
	sharedUrl: string;
	wasOverwrite: boolean;
}

export const DoneView = ({ sharedUrl, wasOverwrite }: Props) => {
	const [copied, setCopied] = useState(false);

	async function handleCopy() {
		await navigator.clipboard.writeText(sharedUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<>
			<p>
				{wasOverwrite
					? 'Your updated sheet can be accessed using the same link as before:'
					: 'Your sheet is now live and can be accessed at:'}
			</p>
			<div className={styles.inputRow}>
				<code className={styles.urlCode}>{sharedUrl}</code>
				<button
					type='button'
					className={styles.wideButton}
					onClick={handleCopy}
				>
					<FaCopy />
					<span>{copied ? 'Copied!' : 'Copy'}</span>
				</button>
			</div>
		</>
	);
};
