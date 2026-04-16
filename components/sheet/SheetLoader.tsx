'use client';

import { useEffect, useState } from 'react';
import { fetchGist } from '@/lib/api/github';
import { engine } from '@/lib/engine';
import { importSheetMd, useSheetStore } from '@/lib/store';
import { BrowserNotice } from './BrowserNotice';
import { ErrorSheet } from './ErrorSheet';
import { LoadingSheet } from './LoadingSheet';
import { Sheet } from './Sheet';

interface Props {
	gistId: string | null;
}

export function SheetLoader({ gistId }: Props) {
	const loadCells = useSheetStore((state) => state.loadCells);
	const [browserNotice, setBrowserNotice] = useState(
		typeof window !== 'undefined' && !window.crossOriginIsolated,
	);
	const [gistState, setGistState] = useState<'idle' | 'loading' | 'error'>(
		'idle',
	);
	const [gistError, setGistError] = useState<string | null>(null);

	useEffect(() => {
		if (!gistId) return;

		setGistState('loading');
		fetchGist(gistId)
			.then((markdown) => {
				const cells = importSheetMd(markdown);
				engine.reset();
				loadCells(cells);
				setGistState('idle');
			})
			.catch((err) => {
				setGistError(
					err instanceof Error ? err.message : 'Failed to load shared sheet',
				);
				setGistState('error');
			});
	}, [gistId, loadCells]);

	if (gistState === 'loading') return <LoadingSheet />;

	if (gistState === 'error') {
		return (
			<ErrorSheet
				error={`Shared sheet not available.${gistError ? ` (${gistError})` : ''}`}
				onContinue={() => setGistState('idle')}
			/>
		);
	}

	if (browserNotice)
		return <BrowserNotice exitBrowserNotice={() => setBrowserNotice(false)} />;

	return <Sheet />;
}
