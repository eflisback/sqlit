import type { SqlValue } from '@sqliteai/sqlite-wasm';

export type SqlResult = {
	[columnName: string]: SqlValue;
}[];
