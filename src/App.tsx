import { useEffect, useState } from 'react';
import { engine } from '@/engine';
import { fetchGist } from '@/api/github';
import { importSheetMd, useSheetStore } from '@/store';
import { BrowserNotice, Sheet } from './pages';

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
				setGistError(
					err instanceof Error ? err.message : 'Failed to load shared sheet',
				);
				setGistState('error');
			});
	}, [loadCells]);

	if (gistState === 'loading') {
		return (
			<p style={{ textAlign: 'center', marginTop: '2rem' }}>
				Loading shared sheet…
			</p>
		);
	}

	if (gistState === 'error') {
		return (
			<div style={{ textAlign: 'center', marginTop: '2rem' }}>
				<p>Failed to load shared sheet: {gistError}</p>
				<button type='button' onClick={() => setGistState('idle')}>
					Continue anyway
				</button>
			</div>
		);
	}

	if (browserNotice) {
		return <BrowserNotice exitBrowserNotice={() => setBrowserNotice(false)} />;
	}

	return <Sheet />;
}

export default App;
