import { sheetFileSchema } from './schema';
import type { CellData } from './types';

export function importSheetJson(json: string): CellData[] {
	const data = JSON.parse(json);
	const parsed = sheetFileSchema.parse(data);
	return parsed.cells.map((cell) =>
		cell.type === 'sql' || cell.type === 'python' || cell.type === 'load'
			? { ...cell, result: null }
			: cell,
	);
}

export function exportSheetMd(cells: CellData[]): string {
	const parts: string[] = [];
	for (const cell of cells) {
		if (cell.type === 'markdown') {
			parts.push(cell.content);
		} else if (cell.type === 'sql' || cell.type === 'python') {
			parts.push(`\`\`\`\`${cell.type}\n${cell.content}\n\`\`\`\``);
		} else if (cell.type === 'load') {
			parts.push(`\`\`\`\`load\n${cell.url}\n\`\`\`\``);
		}
	}
	return parts.join('\n\n');
}

export function importSheetMd(markdown: string): CellData[] {
	const lines = markdown.split('\n');
	const cells: CellData[] = [];

	type State = 'markdown' | 'executable';
	let state: State = 'markdown';
	let buffer: string[] = [];
	let executableType: 'sql' | 'python' | 'load' = 'sql';

	const flushMarkdown = () => {
		const content = buffer.join('\n').trim();
		if (content.length > 0) {
			cells.push({ id: crypto.randomUUID(), type: 'markdown', content });
		}
		buffer = [];
	};

	const flushExecutable = () => {
		const content = buffer.join('\n');
		if (executableType === 'load') {
			cells.push({
				id: crypto.randomUUID(),
				type: 'load',
				url: content.trim(),
				result: null,
			});
		} else {
			cells.push({
				id: crypto.randomUUID(),
				type: executableType,
				content,
				result: null,
			});
		}
		buffer = [];
	};

	for (const line of lines) {
		if (state === 'markdown') {
			const match = line.match(/^````(sql|python|load)\s*$/);
			if (match) {
				flushMarkdown();
				executableType = match[1] as 'sql' | 'python' | 'load';
				state = 'executable';
			} else {
				buffer.push(line);
			}
		} else {
			if (/^````\s*$/.test(line)) {
				flushExecutable();
				state = 'markdown';
			} else {
				buffer.push(line);
			}
		}
	}

	if (state === 'markdown') {
		flushMarkdown();
	}

	return cells;
}
