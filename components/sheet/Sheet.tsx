'use client';

import { useKey } from 'react-use';
import { Cell } from '@/components/cells';
import { useExportSheet } from '@/lib/hooks';
import { history, useSheetStore } from '@/lib/store';
import styles from './Sheet.module.css';

export const Sheet = () => {
	const cells = useSheetStore((state) => state.cells);
	const setEditableCellId = useSheetStore((state) => state.setEditalbeCellId);
	const anyRunning = useSheetStore((state) => state.runningCellId !== null);
	const exportSheet = useExportSheet();

	useKey('Escape', () => setEditableCellId(null));
	useKey(
		(e) => e.ctrlKey && e.key === 's',
		(e) => {
			e.preventDefault();
			exportSheet();
		},
	);
	useKey(
		(e) =>
			e.ctrlKey &&
			!e.shiftKey &&
			e.key === 'z' &&
			!(e.target as HTMLElement).isContentEditable,
		() => {
			if (!anyRunning) history.undo();
		},
	);
	useKey(
		(e) =>
			e.ctrlKey &&
			e.shiftKey &&
			e.key === 'Z' &&
			!(e.target as HTMLElement).isContentEditable,
		() => {
			if (!anyRunning) history.redo();
		},
	);

	return (
		<main className={styles.sheet}>
			{cells.map((cellData) => (
				<Cell key={cellData.id} cellData={cellData} />
			))}
		</main>
	);
};
