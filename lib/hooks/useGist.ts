'use client';
import { useEffect, useState } from 'react';
import {
	createGist,
	fetchGist,
	type GistEntry,
	listSqlitGists,
	updateGist,
} from '../api/github';
import { engine } from '../engine/wrapper';
import { exportSheetMd, importSheetMd } from '../store/sheetFile';
import { useAuthStore } from '../store/useAuthStore';
import { useSheetStore } from '../store/useSheetStore';

export const useLoadGist = () => {
	const loadCells = useSheetStore((state) => state.loadCells);

	const [gistState, setGistState] = useState<'idle' | 'loading' | 'error'>(
		'idle',
	);
	const [gistError, setGistError] = useState<string | null>(null);

	useEffect(() => {
		const gistId = new URLSearchParams(window.location.search).get('gist');
		if (!gistId) return;

		setGistState('loading');
		fetchGist(gistId)
			.then((markdown) => {
				const cells = importSheetMd(markdown);
				engine.reset();
				loadCells(cells);
				history.replaceState(null, '', '/sheet');
				setGistState('idle');
			})
			.catch((err) => {
				history.replaceState(null, '', '/sheet');
				setGistError(
					err instanceof Error ? err.message : 'Failed to load shared sheet',
				);
				setGistState('error');
			});
	}, [loadCells]);

	return {
		gistState,
		gistError,
		setGistState,
	};
};

export const useGistList = (accessToken: string | null) => {
	const [gists, setGists] = useState<GistEntry[]>([]);
	const [gistsLoading, setGistsLoading] = useState(false);
	const [listError, setListError] = useState<string | null>(null);

	useEffect(() => {
		if (!accessToken) return;
		setGistsLoading(true);
		listSqlitGists(accessToken)
			.then(setGists)
			.catch((err) =>
				setListError(err instanceof Error ? err.message : 'Unknown error'),
			)
			.finally(() => setGistsLoading(false));
	}, [accessToken]);

	return { gists, gistsLoading, listError };
};

type ShareUiState = 'idle' | 'sharing' | 'done';

export const useShareGist = () => {
	const accessToken = useAuthStore((state) => state.accessToken);
	const cells = useSheetStore((state) => state.cells);
	const setSharedGistId = useSheetStore((state) => state.setSharedGistId);

	const [uiState, setUiState] = useState<ShareUiState>('idle');
	const [sharedUrl, setSharedUrl] = useState('');
	const [wasOverwrite, setWasOverwrite] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleCreateGist = async (name: string) => {
		if (!accessToken) return;
		setError(null);
		setUiState('sharing');
		try {
			const content = exportSheetMd(cells);
			const result = await createGist(accessToken, content, name);
			setSharedGistId(result.id);
			setSharedUrl(`${window.location.origin}/sheet?gist=${result.id}`);
			setWasOverwrite(false);
			setUiState('done');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error');
			setUiState('idle');
		}
	};

	const handleUpdateGist = async (gistId: string) => {
		if (!accessToken) return;
		setError(null);
		setUiState('sharing');
		try {
			const content = exportSheetMd(cells);
			const result = await updateGist(accessToken, gistId, content);
			setSharedGistId(result.id);
			setSharedUrl(`${window.location.origin}/sheet?gist=${result.id}`);
			setWasOverwrite(true);
			setUiState('done');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error');
			setUiState('idle');
		}
	};

	return {
		uiState,
		sharedUrl,
		wasOverwrite,
		error,
		handleCreateGist,
		handleUpdateGist,
	};
};

export const useGitHubOAuth = () => {
	const setAccessToken = useAuthStore((state) => state.setAccessToken);

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

	return { openOAuthPopup };
};
