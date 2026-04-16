'use client';

import { useCallback, useEffect, useRef } from 'react';

export function useDebouncedCallback<T extends unknown[]>(
	callback: (...args: T) => void,
	delay: number,
): (...args: T) => void {
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	});

	useEffect(() => {
		return () => {
			if (timerRef.current !== null) clearTimeout(timerRef.current);
		};
	}, []);

	return useCallback(
		(...args: T) => {
			if (timerRef.current !== null) clearTimeout(timerRef.current);
			timerRef.current = setTimeout(() => {
				timerRef.current = null;
				callbackRef.current(...args);
			}, delay);
		},
		[delay],
	);
}
