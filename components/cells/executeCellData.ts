import { engine } from '@/lib';
import type { CellResult, ExecutableCellData } from '@/lib';

export async function executeCellData(
	cellData: ExecutableCellData,
): Promise<CellResult> {
	switch (cellData.type) {
		case 'sql':
			return engine.query(cellData.content);
		case 'python':
			return engine.runPython(cellData.content);
		case 'load':
			await engine.loadFromUrl(cellData.url);
			return { kind: 'text', text: 'Database loaded successfully.' };
	}
}
