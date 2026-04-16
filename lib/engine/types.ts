import type { SqlValue } from '@sqliteai/sqlite-wasm';

export type SqlResult = {
	rows: { [columnName: string]: SqlValue }[];
	rowsAffected: number;
};
