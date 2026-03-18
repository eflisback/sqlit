import { FaDatabase, FaFileImport, FaMarkdown, FaPython } from 'react-icons/fa6';
import { engine } from '@/engine';
import type { CellData } from '@/store/types';
import { LoadEditorContent } from './editors/LoadEditorContent';
import { MarkdownEditorContent } from './editors/MarkdownEditorContent';
import { PythonEditorContent } from './editors/PythonEditorContent';
import { SqlEditorContent } from './editors/SqlEditorContent';
import type { CellDefinition } from './types';

type SqlCell = Extract<CellData, { type: 'sql' }>;
type PythonCell = Extract<CellData, { type: 'python' }>;
type MarkdownCell = Extract<CellData, { type: 'markdown' }>;
type LoadCell = Extract<CellData, { type: 'load' }>;

export const cellDefinitions: {
	sql: CellDefinition<SqlCell>;
	python: CellDefinition<PythonCell>;
	markdown: CellDefinition<MarkdownCell>;
	load: CellDefinition<LoadCell>;
} = {
	sql: {
		label: 'sql',
		information: 'Contains code which can be executed on the SQLite database.',
		Icon: FaDatabase,
		execute: async (cellData) => engine.query(cellData.content),
		Editor: SqlEditorContent,
	},
	python: {
		label: 'python',
		information: 'Contains Python code executed via Pyodide with access to the SQLite database.',
		Icon: FaPython,
		execute: async (cellData) => engine.runPython(cellData.content),
		Editor: PythonEditorContent,
	},
	markdown: {
		label: 'info',
		information: 'Used for displaying information to the user.',
		Icon: FaMarkdown,
		execute: null,
		Editor: MarkdownEditorContent,
	},
	load: {
		label: 'load',
		information: 'Can load existing SQLite database files into the SQLite database.',
		Icon: FaFileImport,
		execute: async (cellData) => {
			await engine.loadFromUrl(cellData.url);
			return { kind: 'text', text: 'Database loaded successfully.' };
		},
		Editor: LoadEditorContent,
	},
};

export type CellType = keyof typeof cellDefinitions;
