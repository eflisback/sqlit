import type { Database, Sqlite3Static } from '@sqliteai/sqlite-wasm';
import sqlite3InitModule from '@sqliteai/sqlite-wasm';
import { expose } from 'comlink';
import type { SqlResult } from './types';

let sqlite3: Sqlite3Static | null = null;
let db: Database | null = null;

const getDb = async () => {
	if (!db) {
		sqlite3 = await sqlite3InitModule();
		db = new sqlite3.oo1.DB(':memory:');
	}
	return db;
};

export const engine = {
	query: async (sql: string): Promise<SqlResult> => {
		const db = await getDb();
		const rows = db.exec(sql, { rowMode: 'object', returnValue: 'resultRows' });
		const rowsAffected = db.changes();
		return { rows, rowsAffected };
	},
	loadFromUrl: async (url: string): Promise<void> => {
		if (!sqlite3) {
			sqlite3 = await sqlite3InitModule();
		}
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

		const newDb = new sqlite3.oo1.DB(':memory:');
		const p = sqlite3.wasm.allocFromTypedArray(bytes);
		const rc = sqlite3.capi.sqlite3_deserialize(
			newDb,
			'main',
			p,
			bytes.byteLength,
			bytes.byteLength,
			sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE |
				sqlite3.capi.SQLITE_DESERIALIZE_RESIZEABLE,
		);
		if (rc !== 0) {
			newDb.close();
			throw new Error(`Failed to deserialize database (code ${rc})!`);
		}
		db = newDb;
	},
};

export type Engine = typeof engine;

expose(engine);
