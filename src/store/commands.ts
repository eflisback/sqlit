import type { CellData, MarkdownCellData } from './types';
import { useSheetStore } from './useSheetStore';

export interface Command {
	execute(): void;
	undo(): void;
}

interface MergeInfo {
	mergedCellId: string;
	originalA: MarkdownCellData;
	originalB: MarkdownCellData;
	indexA: number;
}

function mergeMarkdownCells(indexA: number, indexB: number): MergeInfo {
	const { cells, updateCell, removeCell } = useSheetStore.getState();
	const originalA = cells[indexA] as MarkdownCellData;
	const originalB = cells[indexB] as MarkdownCellData;
	const mergedContent =
		originalA.content && originalB.content
			? `${originalA.content}\n\n${originalB.content}`
			: originalA.content || originalB.content;
	updateCell(originalA.id, { ...originalA, content: mergedContent });
	removeCell(originalB.id);
	return { mergedCellId: originalA.id, originalA, originalB, indexA };
}

function unmergeMarkdownCells(info: MergeInfo): void {
	const { updateCell, insertCell } = useSheetStore.getState();
	updateCell(info.mergedCellId, info.originalA);
	insertCell(info.originalB, info.indexA + 1);
}

export class InsertCellCommand implements Command {
	cellData: CellData;
	index: number;

	constructor(cellData: CellData, index: number) {
		this.cellData = cellData;
		this.index = index;
	}

	execute() {
		useSheetStore.getState().insertCell(this.cellData, this.index);
	}

	undo() {
		useSheetStore.getState().removeCell(this.cellData.id);
	}
}

export class RemoveCellCommand implements Command {
	id: string;
	capturedCell: CellData | null = null;
	capturedIndex = -1;
	mergeInfo: MergeInfo | null = null;

	constructor(id: string) {
		this.id = id;
	}

	execute() {
		const { cells, removeCell } = useSheetStore.getState();
		const index = cells.findIndex((c) => c.id === this.id);
		if (index === -1) return;
		this.capturedCell = cells[index];
		this.capturedIndex = index;

		const prev = cells[index - 1];
		const next = cells[index + 1];

		removeCell(this.id);

		if (prev?.type === 'markdown' && next?.type === 'markdown') {
			this.mergeInfo = mergeMarkdownCells(index - 1, index);
		} else {
			this.mergeInfo = null;
		}
	}

	undo() {
		if (this.capturedCell === null) return;
		if (this.mergeInfo !== null) unmergeMarkdownCells(this.mergeInfo);
		useSheetStore.getState().insertCell(this.capturedCell, this.capturedIndex);
	}
}

export class MoveCellCommand implements Command {
	id: string;
	direction: 'up' | 'down';
	mergeInfo: MergeInfo | null = null;

	constructor(id: string, direction: 'up' | 'down') {
		this.id = id;
		this.direction = direction;
	}

	execute() {
		this.mergeInfo = null;
		const { cells } = useSheetStore.getState();
		const idx = cells.findIndex((c) => c.id === this.id);
		if (idx === -1) return;

		useSheetStore.getState().moveCell(this.id, this.direction);

		const swap = this.direction === 'up' ? idx - 1 : idx + 1;
		const newCells = useSheetStore.getState().cells;

		// Check far side: moved cell's new outer neighbor
		const farIdx = this.direction === 'up' ? swap - 1 : swap + 1;
		if (
			newCells[swap]?.type === 'markdown' &&
			newCells[farIdx]?.type === 'markdown'
		) {
			const a = Math.min(swap, farIdx);
			this.mergeInfo = mergeMarkdownCells(a, a + 1);
			return;
		}

		// Check near side: displaced cell's new outer neighbor
		const nearIdx = this.direction === 'up' ? idx + 1 : idx - 1;
		if (
			newCells[idx]?.type === 'markdown' &&
			newCells[nearIdx]?.type === 'markdown'
		) {
			const a = Math.min(idx, nearIdx);
			this.mergeInfo = mergeMarkdownCells(a, a + 1);
		}
	}

	undo() {
		if (this.mergeInfo !== null) {
			unmergeMarkdownCells(this.mergeInfo);
			this.mergeInfo = null;
		}
		const opposite = this.direction === 'up' ? 'down' : 'up';
		useSheetStore.getState().moveCell(this.id, opposite);
	}
}
