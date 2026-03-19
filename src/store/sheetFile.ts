import { sheetFileSchema } from './schema';
import type { CellData } from './types';
import { isExecutableCellData } from './types';

export function exportSheet(cells: CellData[]): string {
	const strippedCells = cells.map((cell) =>
		isExecutableCellData(cell) ? { ...cell, result: undefined } : cell,
	);
	return JSON.stringify({ version: 1, cells: strippedCells }, null, 2);
}

export function importSheet(json: string): CellData[] {
	const data = JSON.parse(json);
	const parsed = sheetFileSchema.parse(data);
	return parsed.cells.map((cell) =>
		cell.type === 'sql' || cell.type === 'python' || cell.type === 'load'
			? { ...cell, result: null }
			: cell,
	);
}
