'use client';

import { useEffect, useState } from 'react';
import { fetchGist } from '@/lib/api/github';
import { engine } from '@/lib/engine';
import { importSheetMd, useSheetStore } from '@/lib/store';

type LoadState = 'idle' | 'loading' | 'error';

interface UseSheetSourceResult {
	loadState: LoadState;
	loadError: string | null;
	clearError: () => void;
}

interface UseSheetSourceOptions {
	gistId?: string;
	remoteUrl?: string;
	blank?: boolean;
}

export function useSheetSource({
	gistId,
	remoteUrl,
	blank,
}: UseSheetSourceOptions): UseSheetSourceResult {
	const loadCells = useSheetStore((state) => state.loadCells);
	const [loadState, setLoadState] = useState<LoadState>('idle');
	const [loadError, setLoadError] = useState<string | null>(null);

	useEffect(() => {
		if (blank) {
			engine.reset();
			loadCells([]);
			return;
		}

		if (gistId) {
			setLoadState('loading');
			fetchGist(gistId)
				.then((markdown) => {
					engine.reset();
					loadCells(importSheetMd(markdown));
					setLoadState('idle');
				})
				.catch((err) => {
					setLoadError(
						err instanceof Error ? err.message : 'Failed to load shared sheet',
					);
					setLoadState('error');
				});
			return;
		}

		if (remoteUrl) {
			setLoadState('loading');
			fetch(remoteUrl)
				.then((res) => {
					if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.status}`);
					return res.text();
				})
				.then((markdown) => {
					engine.reset();
					loadCells(importSheetMd(markdown));
					setLoadState('idle');
				})
				.catch((err) => {
					setLoadError(
						err instanceof Error ? err.message : 'Failed to load remote sheet',
					);
					setLoadState('error');
				});
		}
	}, [gistId, remoteUrl, blank, loadCells]);

	return {
		loadState,
		loadError,
		clearError: () => setLoadState('idle'),
	};
}
