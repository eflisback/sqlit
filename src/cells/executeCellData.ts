import { engine } from '@/engine';
import type { CellData, CellResult } from '@/store/types';

export async function executeCellData(cellData: CellData): Promise<CellResult> {
	switch (cellData.type) {
		case 'sql':
			return engine.query(cellData.content);
		case 'python':
			return engine.runPython(cellData.content);
		case 'load':
			await engine.loadFromUrl(cellData.url);
			return { kind: 'text', text: 'Database loaded successfully.' };
		case 'markdown':
			throw new Error('Cannot execute a markdown cell');
	}
}
