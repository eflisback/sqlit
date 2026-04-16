import type { Database, Sqlite3Static } from '@sqliteai/sqlite-wasm';
import sqlite3InitModule from '@sqliteai/sqlite-wasm';
import type { CellResult } from '../../store/types';

let sqlite3: Sqlite3Static | null = null;
let db: Database | null = null;

export const getSqlite3 = async (): Promise<Sqlite3Static> => {
	if (!sqlite3) {
		sqlite3 = await sqlite3InitModule();
	}
	return sqlite3;
};

export const getDb = async (): Promise<[Database, Sqlite3Static]> => {
	const s3 = await getSqlite3();
	if (!db) {
		db = new s3.oo1.DB(':memory:');
	}
	return [db, s3];
};

export const query = async (sql: string): Promise<CellResult> => {
	const [currentDb] = await getDb();
	const columns: string[] = [];
	const rows = currentDb.exec(sql, {
		rowMode: 'object',
		returnValue: 'resultRows',
		columnNames: columns,
	});
	const rowsAffected = currentDb.changes();
	return { kind: 'table', rows, columns, rowsAffected };
};

export const resetDb = (): void => {
	if (db) {
		db.close();
		db = null;
	}
};

export const loadFromUrl = async (url: string): Promise<void> => {
	const s3 = await getSqlite3();
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(
			`Failed to fetch: ${response.status} ${response.statusText}!`,
		);
	}
	const buffer = await response.arrayBuffer();
	const bytes = new Uint8Array(buffer);

	const magic = new TextDecoder().decode(bytes.slice(0, 16));
	if (magic !== 'SQLite format 3\0') {
		throw new Error('Not a valid SQLite database file!');
	}

	if (db) {
		db.close();
		db = null;
	}

	const newDb = new s3.oo1.DB(':memory:');
	const p = s3.wasm.allocFromTypedArray(bytes);
	const rc = s3.capi.sqlite3_deserialize(
		newDb,
		'main',
		p,
		bytes.byteLength,
		bytes.byteLength,
		s3.capi.SQLITE_DESERIALIZE_FREEONCLOSE |
			s3.capi.SQLITE_DESERIALIZE_RESIZEABLE,
	);
	if (rc !== 0) {
		newDb.close();
		throw new Error(`Failed to deserialize database (code ${rc})!`);
	}
	db = newDb;
};
