'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { engine, fetchGist, importSheetMd, useSheetStore } from '@/lib';

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
	markdown?: string;
}

export function useSheetSource({
	gistId,
	remoteUrl,
	blank,
	markdown,
}: UseSheetSourceOptions): UseSheetSourceResult {
	const router = useRouter();
	const loadCells = useSheetStore((state) => state.loadCells);
	const [loadState, setLoadState] = useState<LoadState>('idle');
	const [loadError, setLoadError] = useState<string | null>(null);

	useEffect(() => {
		if (markdown) {
			engine.reset();
			loadCells(importSheetMd(markdown));
			router.replace('/sheet');
			return;
		}

		if (blank) {
			engine.reset();
			loadCells([]);
			router.replace('/sheet');
			return;
		}

		if (gistId) {
			setLoadState('loading');
			fetchGist(gistId)
				.then((markdown) => {
					engine.reset();
					loadCells(importSheetMd(markdown));
					setLoadState('idle');
					router.replace('/sheet');
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
					router.replace('/sheet');
				})
				.catch((err) => {
					setLoadError(
						err instanceof Error ? err.message : 'Failed to load remote sheet',
					);
					setLoadState('error');
				});
		}
	}, [markdown, gistId, remoteUrl, blank, loadCells, router.replace]);

	return {
		loadState,
		loadError,
		clearError: () => setLoadState('idle'),
	};
}
