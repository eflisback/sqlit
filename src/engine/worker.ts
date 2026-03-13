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
		return db.exec(sql, { rowMode: 'object', returnValue: 'resultRows' });
	},
};

export type Engine = typeof engine;

expose(engine);
