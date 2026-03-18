import type { SqlValue } from '@sqliteai/sqlite-wasm';

export type CellResult =
	| { kind: 'table'; rows: { [columnName: string]: SqlValue }[]; rowsAffected: number }
	| { kind: 'text'; text: string }
	| { kind: 'error'; message: string };

export type CellData =
	| { id: string; type: 'sql'; content: string; result: CellResult | null }
	| { id: string; type: 'python'; content: string; result: CellResult | null }
	| { id: string; type: 'markdown'; content: string; result: CellResult | null }
	| { id: string; type: 'load'; url: string; result: CellResult | null };
