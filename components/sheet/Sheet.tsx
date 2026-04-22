'use client';

import { useKey } from 'react-use';
import { Cell } from '../cells/Cell';
import { history, useExportSheet, useSheetStore } from '@/lib';
import { EmptySheet } from './EmptySheet';
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

	if (cells.length === 0) return <EmptySheet />;

	return (
		<main className={styles.sheet}>
			{cells.map((cellData) => (
				<Cell key={cellData.id} cellData={cellData} />
			))}
		</main>
	);
};
