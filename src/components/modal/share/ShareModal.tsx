import { useState } from 'react';
import {
	createGist,
	type GistEntry,
	listSqlitGists,
	updateGist,
} from '@/api/github';
import {
	exportSheetMd,
	saveSheetMd,
	useAuthStore,
	useSheetStore,
} from '@/store';
import styles from '../Modal.module.css';
import { DoneView } from './DoneView';
import { GistPickerView } from './GistPickerView';
import { IdleView } from './IdleView';
import { LoginView } from './LoginView';

type UiState = 'idle' | 'picking' | 'sharing' | 'done';

export const ShareModal = () => {
	const accessToken = useAuthStore((state) => state.accessToken);
	const setAccessToken = useAuthStore((state) => state.setAccessToken);
	const cells = useSheetStore((state) => state.cells);
	const sharedGistId = useSheetStore((state) => state.sharedGistId);
	const setSharedGistId = useSheetStore((state) => state.setSharedGistId);

	const [uiState, setUiState] = useState<UiState>('idle');
	const [gists, setGists] = useState<GistEntry[]>([]);
	const [gistsLoading, setGistsLoading] = useState(false);
	const [sharedUrl, setSharedUrl] = useState('');
	const [error, setError] = useState<string | null>(null);

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

	const handleCreateGist = async (name: string) => {
		if (!accessToken) return;
		setError(null);
		setUiState('sharing');
		try {
			const content = exportSheetMd(cells);
			const result = await createGist(accessToken, content, name);
			setSharedGistId(result.id);
			setSharedUrl(`${window.location.origin}?gist=${result.id}`);
			setUiState('done');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error');
			setUiState('idle');
		}
	};

	const handleOverwritePrevious = async () => {
		if (!accessToken || !sharedGistId) return;
		setError(null);
		setUiState('sharing');
		try {
			const content = exportSheetMd(cells);
			const result = await updateGist(accessToken, sharedGistId, content);
			setSharedGistId(result.id);
			setSharedUrl(`${window.location.origin}?gist=${result.id}`);
			setUiState('done');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error');
			setUiState('idle');
		}
	};

	const handlePickGist = async () => {
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
	};

	const handleSelectGist = async (id: string) => {
		if (!accessToken) return;
		setError(null);
		setUiState('sharing');
		try {
			const content = exportSheetMd(cells);
			const result = await updateGist(accessToken, id, content);
			setSharedGistId(result.id);
			setSharedUrl(`${window.location.origin}?gist=${result.id}`);
			setUiState('done');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error');
			setUiState('idle');
		}
	};

	const handleExportFile = () => saveSheetMd(cells);
	const handleLogout = () => setAccessToken(null);

	if (!accessToken) {
		return (
			<LoginView onLogin={openOAuthPopup} onExportFile={handleExportFile} />
		);
	}

	if (uiState === 'sharing') {
		return <p className={styles.spinnerText}>Sharing…</p>;
	}

	if (uiState === 'done') {
		return (
			<DoneView
				sharedUrl={sharedUrl}
				onShareAgain={() => {
					setUiState('idle');
					setSharedUrl('');
				}}
			/>
		);
	}

	if (uiState === 'picking') {
		return (
			<GistPickerView
				gists={gists}
				loading={gistsLoading}
				onSelect={handleSelectGist}
				onBack={() => setUiState('idle')}
			/>
		);
	}

	return (
		<IdleView
			sharedGistId={sharedGistId}
			error={error}
			onCreateGist={handleCreateGist}
			onOverwritePrevious={handleOverwritePrevious}
			onPickGist={handlePickGist}
			onLogout={handleLogout}
		/>
	);
};
