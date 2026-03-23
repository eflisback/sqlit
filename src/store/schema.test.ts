import { describe, expect, it } from 'vitest';
import { sheetFileSchema } from './schema';

const validBase = { id: 'abc', content: 'SELECT 1' };

describe('sheetFileSchema', () => {
	it('parses a valid sql cell', () => {
		const result = sheetFileSchema.parse({
			version: 1,
			cells: [{ id: '1', type: 'sql', content: 'SELECT 1' }],
		});
		expect(result.cells[0].type).toBe('sql');
	});

	it('parses a valid python cell', () => {
		const result = sheetFileSchema.parse({
			version: 1,
			cells: [{ id: '1', type: 'python', content: 'print()' }],
		});
		expect(result.cells[0].type).toBe('python');
	});

	it('parses a valid load cell', () => {
		const result = sheetFileSchema.parse({
			version: 1,
			cells: [{ id: '1', type: 'load', url: 'https://example.com/db.sqlite' }],
		});
		expect(result.cells[0].type).toBe('load');
	});

	it('parses a valid markdown cell', () => {
		const result = sheetFileSchema.parse({
			version: 1,
			cells: [{ id: '1', type: 'markdown', content: '# hi' }],
		});
		expect(result.cells[0].type).toBe('markdown');
	});

	it('parses an empty cells array', () => {
		const result = sheetFileSchema.parse({ version: 1, cells: [] });
		expect(result.cells).toHaveLength(0);
	});

	it('throws on wrong version', () => {
		expect(() => sheetFileSchema.parse({ version: 2, cells: [] })).toThrow();
	});

	it('throws when version is missing', () => {
		expect(() => sheetFileSchema.parse({ cells: [] })).toThrow();
	});

	it('throws on unknown cell type', () => {
		expect(() =>
			sheetFileSchema.parse({
				version: 1,
				cells: [{ id: '1', type: 'video', src: 'foo' }],
			}),
		).toThrow();
	});

	it('throws when required cell fields are missing', () => {
		expect(() =>
			sheetFileSchema.parse({
				version: 1,
				cells: [{ type: 'sql' }], // missing id and content
			}),
		).toThrow();
	});

	it('ignores extra fields on cells', () => {
		// Zod strips unknown keys by default (or passes through — just assert it doesn't throw)
		expect(() =>
			sheetFileSchema.parse({
				version: 1,
				cells: [
					{ id: '1', type: 'sql', content: 'SELECT 1', extra: 'ignored' },
				],
			}),
		).not.toThrow();
	});

	it('throws when cells is not an array', () => {
		expect(() =>
			sheetFileSchema.parse({ version: 1, cells: 'not an array' }),
		).toThrow();
	});

	it('throws when load cell has content instead of url', () => {
		expect(() =>
			sheetFileSchema.parse({
				version: 1,
				cells: [{ ...validBase, type: 'load' }], // has content, not url
			}),
		).toThrow();
	});
});
