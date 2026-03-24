import { useKey } from 'react-use';
import { Cell } from '@/cells';
import { history, saveSheetMd, useSheetStore } from '@/store';
import { Header } from './Header';
import styles from './Sheet.module.css';

export const Sheet = () => {
	const cells = useSheetStore((state) => state.cells);
	const setEditableCellId = useSheetStore((state) => state.setEditalbeCellId);
	const anyRunning = useSheetStore((state) => state.runningCellId !== null);

	useKey('Escape', () => setEditableCellId(null));
	useKey(
		(e) => e.ctrlKey && e.key === 's',
		(e) => {
			e.preventDefault();
			saveSheetMd(cells);
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
		<>
			<Header />
			<main className={styles.sheet}>
				{cells.map((cellData) => (
					<Cell key={cellData.id} cellData={cellData} />
				))}
			</main>
		</>
	);
};
