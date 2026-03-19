import type { SqlValue } from '@sqliteai/sqlite-wasm';

export type CellResult =
	| {
			kind: 'table';
			rows: { [columnName: string]: SqlValue }[];
			rowsAffected: number;
	  }
	| { kind: 'text'; text: string }
	| { kind: 'error'; message: string };

export interface SqlCellData      { id: string; type: 'sql';      content: string; result: CellResult | null }
export interface PythonCellData   { id: string; type: 'python';   content: string; result: CellResult | null }
export interface LoadCellData     { id: string; type: 'load';     url: string;     result: CellResult | null }
export interface MarkdownCellData { id: string; type: 'markdown'; content: string }

export type ExecutableCellData = SqlCellData | PythonCellData | LoadCellData;
export type StaticCellData = MarkdownCellData;
export type CellData = StaticCellData | ExecutableCellData;

export function isExecutableCellData(cell: CellData): cell is ExecutableCellData {
	return cell.type === 'sql' || cell.type === 'python' || cell.type === 'load';
}
