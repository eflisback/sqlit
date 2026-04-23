'use client';

import { useState } from 'react';
import { BrowserNotice } from './BrowserNotice';
import { ErrorSheet } from './ErrorSheet';
import { LoadingSheet } from './LoadingSheet';
import { Sheet } from './Sheet';
import { useSheetSource } from './useSheetSource';

export interface SheetLoaderProps {
	gistId?: string;
	remoteUrl?: string;
	blank?: boolean;
	markdown?: string;
}

export function SheetLoader({
	gistId,
	remoteUrl,
	blank,
	markdown,
}: SheetLoaderProps) {
	const [browserNotice, setBrowserNotice] = useState(
		typeof window !== 'undefined' && !window.crossOriginIsolated,
	);
	const { loadState, loadError, clearError } = useSheetSource({
		gistId,
		remoteUrl,
		blank,
		markdown,
	});

	if (loadState === 'loading') return <LoadingSheet />;

	if (loadState === 'error') {
		return (
			<ErrorSheet
				error={`Sheet not available.${loadError ? ` (${loadError})` : ''}`}
				onContinue={clearError}
			/>
		);
	}

	if (browserNotice)
		return <BrowserNotice exitBrowserNotice={() => setBrowserNotice(false)} />;

	return <Sheet />;
}
