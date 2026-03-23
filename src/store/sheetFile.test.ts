import { describe, expect, it } from 'vitest';
import { exportSheetMd, importSheetJson, importSheetMd } from './sheetFile';
import type { CellData } from './types';

describe('importSheetMd', () => {
	it('parses a sql cell', () => {
		const md = '````sql\nSELECT 1\n````';
		const cells = importSheetMd(md);
		expect(cells).toHaveLength(1);
		expect(cells[0].type).toBe('sql');
		expect((cells[0] as Extract<CellData, { type: 'sql' }>).content).toBe(
			'SELECT 1',
		);
	});

	it('parses a python cell', () => {
		const md = '````python\nprint("hello")\n````';
		const cells = importSheetMd(md);
		expect(cells).toHaveLength(1);
		expect(cells[0].type).toBe('python');
	});

	it('parses a load cell', () => {
		const md = '````load\nhttps://example.com/data.sqlite\n````';
		const cells = importSheetMd(md);
		expect(cells).toHaveLength(1);
		expect(cells[0].type).toBe('load');
		expect((cells[0] as Extract<CellData, { type: 'load' }>).url).toBe(
			'https://example.com/data.sqlite',
		);
	});

	it('parses a markdown cell', () => {
		const md = '# Hello\nworld';
		const cells = importSheetMd(md);
		expect(cells).toHaveLength(1);
		expect(cells[0].type).toBe('markdown');
		expect((cells[0] as Extract<CellData, { type: 'markdown' }>).content).toBe(
			'# Hello\nworld',
		);
	});

	it('parses mixed cells in order', () => {
		const md = '# Intro\n\n````sql\nSELECT 1\n````\n\n## Results';
		const cells = importSheetMd(md);
		expect(cells).toHaveLength(3);
		expect(cells[0].type).toBe('markdown');
		expect(cells[1].type).toBe('sql');
		expect(cells[2].type).toBe('markdown');
	});

	it('generates unique ids for each cell', () => {
		const md = '````sql\nSELECT 1\n````\n\n````sql\nSELECT 2\n````';
		const cells = importSheetMd(md);
		expect(cells[0].id).not.toBe(cells[1].id);
	});

	it('sets result to null for executable cells', () => {
		const md = '````sql\nSELECT 1\n````';
		const cells = importSheetMd(md);
		expect((cells[0] as Extract<CellData, { type: 'sql' }>).result).toBeNull();
	});

	it('returns empty array for empty input', () => {
		expect(importSheetMd('')).toHaveLength(0);
		expect(importSheetMd('   \n  ')).toHaveLength(0);
	});

	it('handles markdown-only notebook', () => {
		const md = '# Title\n\nSome text here.';
		const cells = importSheetMd(md);
		expect(cells).toHaveLength(1);
		expect(cells[0].type).toBe('markdown');
	});

	it('handles adjacent cells of the same type', () => {
		const md = '````sql\nSELECT 1\n````\n\n````sql\nSELECT 2\n````';
		const cells = importSheetMd(md);
		expect(cells).toHaveLength(2);
		expect(cells[0].type).toBe('sql');
		expect(cells[1].type).toBe('sql');
		expect((cells[0] as Extract<CellData, { type: 'sql' }>).content).toBe(
			'SELECT 1',
		);
		expect((cells[1] as Extract<CellData, { type: 'sql' }>).content).toBe(
			'SELECT 2',
		);
	});

	it('treats unknown executable type as markdown text', () => {
		const md = '````unknown\nfoo\n````';
		const cells = importSheetMd(md);
		// The opening/closing fence lines become part of a markdown cell
		expect(cells.every((c) => c.type === 'markdown')).toBe(true);
	});
});

describe('exportSheetMd', () => {
	it('serializes a sql cell', () => {
		const cells: CellData[] = [
			{ id: '1', type: 'sql', content: 'SELECT 1', result: null },
		];
		const md = exportSheetMd(cells);
		expect(md).toBe('````sql\nSELECT 1\n````');
	});

	it('serializes a python cell', () => {
		const cells: CellData[] = [
			{ id: '1', type: 'python', content: 'print("hi")', result: null },
		];
		const md = exportSheetMd(cells);
		expect(md).toBe('````python\nprint("hi")\n````');
	});

	it('serializes a load cell', () => {
		const cells: CellData[] = [
			{
				id: '1',
				type: 'load',
				url: 'https://example.com/db.sqlite',
				result: null,
			},
		];
		const md = exportSheetMd(cells);
		expect(md).toBe('````load\nhttps://example.com/db.sqlite\n````');
	});

	it('serializes a markdown cell as raw text', () => {
		const cells: CellData[] = [
			{ id: '1', type: 'markdown', content: '# Hello' },
		];
		const md = exportSheetMd(cells);
		expect(md).toBe('# Hello');
	});

	it('joins multiple cells with double newline', () => {
		const cells: CellData[] = [
			{ id: '1', type: 'markdown', content: '# Title' },
			{ id: '2', type: 'sql', content: 'SELECT 1', result: null },
		];
		const md = exportSheetMd(cells);
		expect(md).toBe('# Title\n\n````sql\nSELECT 1\n````');
	});

	it('returns empty string for empty array', () => {
		expect(exportSheetMd([])).toBe('');
	});
});

describe('importSheetMd round-trip', () => {
	it('round-trips a notebook with all cell types', () => {
		const original: CellData[] = [
			{ id: '1', type: 'markdown', content: '# Notebook' },
			{ id: '2', type: 'sql', content: 'SELECT * FROM users', result: null },
			{ id: '3', type: 'python', content: 'print("hello")', result: null },
			{
				id: '4',
				type: 'load',
				url: 'https://example.com/db.sqlite',
				result: null,
			},
		];
		const md = exportSheetMd(original);
		const restored = importSheetMd(md);
		expect(restored).toHaveLength(4);
		expect(restored[0].type).toBe('markdown');
		expect(
			(restored[0] as Extract<CellData, { type: 'markdown' }>).content,
		).toBe('# Notebook');
		expect(restored[1].type).toBe('sql');
		expect((restored[1] as Extract<CellData, { type: 'sql' }>).content).toBe(
			'SELECT * FROM users',
		);
		expect(restored[2].type).toBe('python');
		expect(restored[3].type).toBe('load');
		expect((restored[3] as Extract<CellData, { type: 'load' }>).url).toBe(
			'https://example.com/db.sqlite',
		);
	});
});

describe('importSheetJson', () => {
	it('parses valid JSON', () => {
		const json = JSON.stringify({
			version: 1,
			cells: [{ id: 'a', type: 'sql', content: 'SELECT 1' }],
		});
		const cells = importSheetJson(json);
		expect(cells).toHaveLength(1);
		expect(cells[0].type).toBe('sql');
		expect((cells[0] as Extract<CellData, { type: 'sql' }>).result).toBeNull();
	});

	it('throws on invalid JSON string', () => {
		expect(() => importSheetJson('not json')).toThrow();
	});

	it('throws when version is wrong', () => {
		const json = JSON.stringify({ version: 2, cells: [] });
		expect(() => importSheetJson(json)).toThrow();
	});

	it('throws when a cell has an unknown type', () => {
		const json = JSON.stringify({
			version: 1,
			cells: [{ id: 'a', type: 'video', src: 'foo' }],
		});
		expect(() => importSheetJson(json)).toThrow();
	});

	it('strips result from executable cells', () => {
		const json = JSON.stringify({
			version: 1,
			cells: [
				{
					id: 'a',
					type: 'sql',
					content: 'SELECT 1',
					result: { kind: 'table' },
				},
				{
					id: 'b',
					type: 'python',
					content: 'print()',
					result: { kind: 'text' },
				},
				{ id: 'c', type: 'load', url: 'http://x.com', result: null },
			],
		});
		const cells = importSheetJson(json);
		for (const cell of cells) {
			if (cell.type !== 'markdown') {
				expect((cell as Extract<CellData, { type: 'sql' }>).result).toBeNull();
			}
		}
	});
});
