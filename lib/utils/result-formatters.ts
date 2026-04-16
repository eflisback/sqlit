import type { SqlValue } from '@sqliteai/sqlite-wasm';
import type { CellResult } from '@/lib/store';

export type TableResult = Extract<CellResult, { kind: 'table' }>;

export const tableToCsv = (result: TableResult): string => {
	const escapeCsv = (v: SqlValue) => {
		const s = v == null ? '' : String(v);
		return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
	};
	const header = result.columns.join(',');
	const rows = result.rows.map((row) =>
		result.columns.map((col) => escapeCsv(row[col])).join(','),
	);
	return [header, ...rows].join('\n');
};

export const tableToMarkdown = (result: TableResult): string => {
	const colWidths = result.columns.map((col) =>
		Math.max(
			col.length,
			...result.rows.map((row) => String(row[col] ?? '').length),
		),
	);
	const pad = (s: string, w: number) => s.padEnd(w);
	const header = `| ${result.columns.map((col, i) => pad(col, colWidths[i])).join(' | ')} |`;
	const separator = `| ${colWidths.map((w) => '-'.repeat(w)).join(' | ')} |`;
	const rows = result.rows.map(
		(row) =>
			`| ${result.columns.map((col, i) => pad(String(row[col] ?? ''), colWidths[i])).join(' | ')} |`,
	);
	return [header, separator, ...rows].join('\n');
};
