import { useState } from 'react';
import { FaGithub } from 'react-icons/fa6';
import {
	createGist,
	type GistEntry,
	listSqlitGists,
	updateGist,
} from '@/api/github';
import { exportSheetMd, useAuthStore, useSheetStore } from '@/store';
import styles from './Modal.module.css';

type State = 'idle' | 'picking' | 'sharing' | 'done';

export const ShareModal = () => {
	const accessToken = useAuthStore((state) => state.accessToken);
	const setAccessToken = useAuthStore((state) => state.setAccessToken);
	const cells = useSheetStore((state) => state.cells);

	const [uiState, setUiState] = useState<State>('idle');
	const [gists, setGists] = useState<GistEntry[]>([]);
	const [gistsLoading, setGistsLoading] = useState(false);
	const [sharedUrl, setSharedUrl] = useState('');
	const [copied, setCopied] = useState(false);
	const [error, setError] = useState<string | null>(null);

	function openOAuthPopup() {
		const popup = window.open(
			'/api/oauth/start',
			'github-oauth',
			'width=600,height=700',
		);
		if (!popup) {
			alert(
				'Popup was blocked. Please allow popups for this site and try again.',
			);
			return;
		}
		const channel = new BroadcastChannel('oauth');
		channel.addEventListener('message', (e) => {
			if (e.data?.accessToken) {
				setAccessToken(e.data.accessToken);
				channel.close();
			}
		});
	}

	async function handleCreateGist() {
		if (!accessToken) return;
		setError(null);
		setUiState('sharing');
		try {
			const content = exportSheetMd(cells);
			const result = await createGist(accessToken, content);
			setSharedUrl(`${window.location.origin}?gist=${result.id}`);
			setUiState('done');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error');
			setUiState('idle');
		}
	}

	async function handlePickGist() {
		if (!accessToken) return;
		setError(null);
		setUiState('picking');
		setGistsLoading(true);
		try {
			const list = await listSqlitGists(accessToken);
			setGists(list);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error');
			setUiState('idle');
		} finally {
			setGistsLoading(false);
		}
	}

	async function handleOverwriteGist(gistId: string) {
		if (!accessToken) return;
		setError(null);
		setUiState('sharing');
		try {
			const content = exportSheetMd(cells);
			const result = await updateGist(accessToken, gistId, content);
			setSharedUrl(`${window.location.origin}?gist=${result.id}`);
			setUiState('done');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error');
			setUiState('idle');
		}
	}

	async function handleCopy() {
		await navigator.clipboard.writeText(sharedUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	if (!accessToken) {
		return (
			<>
				<p>Sign in with GitHub to create a sharable link using Gists.</p>
				<button
					type='button'
					className={styles.loginButton}
					onClick={openOAuthPopup}
				>
					<FaGithub />
					Log in with GitHub
				</button>
			</>
		);
	}

	if (uiState === 'done') {
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
				<button
					type='button'
					className={styles.textButton}
					onClick={() => {
						setUiState('idle');
						setSharedUrl('');
					}}
				>
					Share again
				</button>
			</>
		);
	}

	if (uiState === 'sharing') {
		return <p className={styles.spinnerText}>Sharing…</p>;
	}

	if (uiState === 'picking') {
		return (
			<>
				<button
					type='button'
					className={styles.textButton}
					onClick={() => setUiState('idle')}
				>
					← Back
				</button>
				{gistsLoading ? (
					<p className={styles.spinnerText}>Loading…</p>
				) : gists.length === 0 ? (
					<p>No existing sqlit sheets found.</p>
				) : (
					<ul className={styles.gistList}>
						{gists.map((gist) => (
							<li key={gist.id}>
								<button
									type='button'
									className={styles.gistItem}
									onClick={() => handleOverwriteGist(gist.id)}
								>
									<span className={styles.gistDescription}>
										{gist.description || '(no description)'}
									</span>
									<span className={styles.gistDate}>
										{new Date(gist.updatedAt).toLocaleDateString()}
									</span>
								</button>
							</li>
						))}
					</ul>
				)}
			</>
		);
	}

	// idle state
	return (
		<>
			{error && <p className={styles.errorText}>{error}</p>}
			<button
				type='button'
				className={styles.loginButton}
				onClick={handleCreateGist}
			>
				Create new Gist
			</button>
			<button
				type='button'
				className={styles.loginButton}
				onClick={handlePickGist}
			>
				Overwrite existing Gist
			</button>
			<button
				type='button'
				className={styles.textButton}
				onClick={() => setAccessToken(null)}
			>
				Log out
			</button>
		</>
	);
};
