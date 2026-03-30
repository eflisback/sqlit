import { useEffect, useState } from 'react';
import { fetchGist } from '@/api/github';
import { engine } from '@/engine';
import { importSheetMd, useSheetStore } from '@/store';
import { BrowserNotice, ErrorSheet, LoadingSheet, Sheet } from './pages';

function App() {
	const loadCells = useSheetStore((state) => state.loadCells);
	const [browserNotice, setBrowserNotice] = useState(
		!window.crossOriginIsolated,
	);
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
				history.replaceState(null, '', '/');
				setGistState('idle');
			})
			.catch((err) => {
				history.replaceState(null, '', '/');
				setGistError(
					err instanceof Error ? err.message : 'Failed to load shared sheet',
				);
				setGistState('error');
			});
	}, [loadCells]);

	if (gistState === 'loading') {
		return <LoadingSheet />;
	}

	if (gistState === 'error') {
		const baseError = 'Shared sheet not available.';
		return (
			<ErrorSheet
				error={baseError + gistError ? `(${gistError})` : ''}
				onContinue={() => setGistState('idle')}
			/>
		);
	}

	if (browserNotice) {
		return <BrowserNotice exitBrowserNotice={() => setBrowserNotice(false)} />;
	}

	return <Sheet />;
}

export default App;
