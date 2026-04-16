'use client';

import { useEffect, useState } from 'react';
import {
	FaFileExport,
	FaFilePen,
	FaGithub,
	FaLink,
	FaXmark,
} from 'react-icons/fa6';
import {
	createGist,
	type GistEntry,
	listSqlitGists,
	updateGist,
} from '@/lib/api/github';
import { useExportSheet } from '@/lib/hooks';
import { exportSheetMd, useAuthStore, useSheetStore } from '@/lib/store';
import styles from '../Modal.module.css';
import { DoneView } from './DoneView';

type UiState = 'idle' | 'sharing' | 'done';

export const ShareModal = () => {
	const accessToken = useAuthStore((state) => state.accessToken);
	const setAccessToken = useAuthStore((state) => state.setAccessToken);
	const cells = useSheetStore((state) => state.cells);
	const sharedGistId = useSheetStore((state) => state.sharedGistId);
	const setSharedGistId = useSheetStore((state) => state.setSharedGistId);
	const exportSheet = useExportSheet();

	const [uiState, setUiState] = useState<UiState>('idle');
	const [gists, setGists] = useState<GistEntry[]>([]);
	const [gistsLoading, setGistsLoading] = useState(false);
	const [sharedUrl, setSharedUrl] = useState('');
	const [wasOverwrite, setWasOverwrite] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [name, setName] = useState('');
	const [selectedGistId, setSelectedGistId] = useState(sharedGistId ?? '');

	useEffect(() => {
		setSelectedGistId(sharedGistId ?? '');
	}, [sharedGistId]);

	useEffect(() => {
		if (!accessToken) return;
		setGistsLoading(true);
		listSqlitGists(accessToken)
			.then(setGists)
			.catch((err) =>
				setError(err instanceof Error ? err.message : 'Unknown error'),
			)
			.finally(() => setGistsLoading(false));
	}, [accessToken]);

	const isDuplicate =
		name.trim() !== '' && gists.some((g) => g.description === name.trim());

	const openOAuthPopup = () => {
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
	};

	const handleCreateGist = async () => {
		if (!accessToken) return;
		setError(null);
		setUiState('sharing');
		try {
			const content = exportSheetMd(cells);
			const result = await createGist(accessToken, content, name.trim());
			setSharedGistId(result.id);
			setSharedUrl(`${window.location.origin}/sheet?gist=${result.id}`);
			setWasOverwrite(false);
			setUiState('done');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error');
			setUiState('idle');
		}
	};

	const handleSelectGist = async () => {
		if (!accessToken) return;
		setError(null);
		setUiState('sharing');
		try {
			const content = exportSheetMd(cells);
			const result = await updateGist(accessToken, selectedGistId, content);
			setSharedGistId(result.id);
			setSharedUrl(`${window.location.origin}/sheet?gist=${result.id}`);
			setWasOverwrite(true);
			setUiState('done');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error');
			setUiState('idle');
		}
	};

	const handleExportFile = () => exportSheet();
	const handleLogout = () => setAccessToken(null);

	if (uiState === 'sharing') {
		return <p className={styles.spinnerText}>Sharing…</p>;
	}

	if (uiState === 'done') {
		return <DoneView sharedUrl={sharedUrl} wasOverwrite={wasOverwrite} />;
	}

	return (
		<>
			{error && <p className={styles.errorText}>{error}</p>}
			{accessToken ? (
				<>
					<p>Name your sheet and generate a new shareable link.</p>
					<div className={styles.inputRow}>
						<input
							type='text'
							className={styles.nameInput}
							placeholder='Sheet name...'
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<button
							type='button'
							className={styles.wideButton}
							disabled={name.trim() === '' || isDuplicate}
							onClick={handleCreateGist}
						>
							<FaLink />
							<span>Get link</span>
						</button>
					</div>
					{isDuplicate && (
						<div className={styles.warningText}>
							<FaXmark />
							<span>
								A sheet with this name already exists. Overwrite instead in
								option below.
							</span>
						</div>
					)}
					<div className={styles.divider}>
						<span>or</span>
					</div>
					<p>Overwrite an existing sheet with the current data.</p>
					<div className={styles.inputRow}>
						<select
							className={styles.gistSelect}
							value={selectedGistId}
							onChange={(e) => setSelectedGistId(e.target.value)}
							disabled={gistsLoading}
						>
							<option value=''>
								{gistsLoading ? 'Loading…' : 'Select a sheet…'}
							</option>
							{gists.map((g) => (
								<option key={g.id} value={g.id}>
									{g.description || g.id}
								</option>
							))}
						</select>
						<button
							type='button'
							className={styles.wideButton}
							disabled={selectedGistId === ''}
							onClick={handleSelectGist}
						>
							<FaFilePen />
							<span>Overwrite</span>
						</button>
					</div>
				</>
			) : (
				<>
					<p>
						Log in with GitHub to create a shareable link (uses{' '}
						<a href='https://gist.github.com/' target='_blank' rel='noopener'>
							Gists
						</a>{' '}
						under the hood).
					</p>
					<button
						type='button'
						className={styles.wideButton}
						onClick={openOAuthPopup}
					>
						<FaGithub />
						<span>Log in with GitHub</span>
					</button>
				</>
			)}
			<div className={styles.divider}>
				<span>or</span>
			</div>
			<p>
				Simply download your sheet as a <code>.sqlit.md</code> file and
				distribute it however you want.
			</p>
			<button
				type='button'
				className={styles.wideButton}
				onClick={handleExportFile}
			>
				<FaFileExport />
				<span>Export as file</span>
			</button>
			{accessToken && (
				<button
					type='button'
					className={styles.textButton}
					onClick={handleLogout}
				>
					Log out
				</button>
			)}
		</>
	);
};
