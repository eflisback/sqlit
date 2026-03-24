import type { CellData } from './types';
import { useSheetStore } from './useSheetStore';

export interface Command {
	execute(): void;
	undo(): void;
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

	constructor(id: string) {
		this.id = id;
	}

	execute() {
		const { cells, removeCell } = useSheetStore.getState();
		const index = cells.findIndex((c) => c.id === this.id);
		if (index === -1) return;
		this.capturedCell = cells[index];
		this.capturedIndex = index;
		removeCell(this.id);
	}

	undo() {
		if (this.capturedCell === null) return;
		useSheetStore.getState().insertCell(this.capturedCell, this.capturedIndex);
	}
}

export class MoveCellCommand implements Command {
	id: string;
	direction: 'up' | 'down';

	constructor(id: string, direction: 'up' | 'down') {
		this.id = id;
		this.direction = direction;
	}

	execute() {
		useSheetStore.getState().moveCell(this.id, this.direction);
	}

	undo() {
		const opposite = this.direction === 'up' ? 'down' : 'up';
		useSheetStore.getState().moveCell(this.id, opposite);
	}
}
