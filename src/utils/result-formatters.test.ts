import { describe, expect, it } from 'vitest';
import { tableToCsv, tableToMarkdown } from './result-formatters';

type TableResult = {
	kind: 'table';
	columns: string[];
	rows: { [col: string]: string | number | null }[];
	rowsAffected: number;
};

const makeTable = (
	columns: string[],
	rows: { [col: string]: string | number | null }[],
): TableResult => ({ kind: 'table', columns, rows, rowsAffected: rows.length });

describe('tableToCsv', () => {
	it('produces header row', () => {
		const result = makeTable(['id', 'name'], []);
		expect(tableToCsv(result)).toBe('id,name');
	});

	it('produces data rows', () => {
		const result = makeTable(['id', 'name'], [{ id: 1, name: 'Alice' }]);
		expect(tableToCsv(result)).toBe('id,name\n1,Alice');
	});

	it('handles multiple rows', () => {
		const result = makeTable(
			['id', 'name'],
			[
				{ id: 1, name: 'Alice' },
				{ id: 2, name: 'Bob' },
			],
		);
		expect(tableToCsv(result)).toBe('id,name\n1,Alice\n2,Bob');
	});

	it('escapes values containing commas', () => {
		const result = makeTable(['val'], [{ val: 'a,b' }]);
		expect(tableToCsv(result)).toBe('val\n"a,b"');
	});

	it('escapes values containing double quotes', () => {
		const result = makeTable(['val'], [{ val: 'say "hi"' }]);
		expect(tableToCsv(result)).toBe('val\n"say ""hi"""');
	});

	it('escapes values containing newlines', () => {
		const result = makeTable(['val'], [{ val: 'line1\nline2' }]);
		expect(tableToCsv(result)).toBe('val\n"line1\nline2"');
	});

	it('renders null as empty string', () => {
		const result = makeTable(['val'], [{ val: null }]);
		expect(tableToCsv(result)).toBe('val\n');
	});

	it('handles numeric values', () => {
		const result = makeTable(['n'], [{ n: 42 }]);
		expect(tableToCsv(result)).toBe('n\n42');
	});
});

describe('tableToMarkdown', () => {
	it('produces header and separator', () => {
		const result = makeTable(['id', 'name'], []);
		const lines = tableToMarkdown(result).split('\n');
		expect(lines[0]).toMatch(/^\|.*id.*\|/);
		expect(lines[1]).toMatch(/^\|[-| ]+\|$/);
	});

	it('produces data rows', () => {
		const result = makeTable(['id', 'name'], [{ id: 1, name: 'Alice' }]);
		const lines = tableToMarkdown(result).split('\n');
		expect(lines).toHaveLength(3);
		expect(lines[2]).toContain('1');
		expect(lines[2]).toContain('Alice');
	});

	it('pads columns to consistent width', () => {
		const result = makeTable(['name'], [{ name: 'Al' }, { name: 'Alexander' }]);
		const lines = tableToMarkdown(result).split('\n');
		// All data lines should be the same length
		expect(lines[0].length).toBe(lines[2].length);
		expect(lines[0].length).toBe(lines[3].length);
	});

	it('renders null as empty string', () => {
		const result = makeTable(['val'], [{ val: null }]);
		const lines = tableToMarkdown(result).split('\n');
		expect(lines[2]).not.toContain('null');
	});

	it('handles empty rows', () => {
		const result = makeTable(['a', 'b'], []);
		const lines = tableToMarkdown(result).split('\n');
		expect(lines).toHaveLength(2); // header + separator only
	});
});
