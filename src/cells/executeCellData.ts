import { engine } from '@/engine';
import type { CellResult, ExecutableCellData } from '@/store/types';
import { proxyUrl } from './proxyUrl';

export async function executeCellData(
	cellData: ExecutableCellData,
): Promise<CellResult> {
	switch (cellData.type) {
		case 'sql':
			return engine.query(cellData.content);
		case 'python':
			return engine.runPython(cellData.content);
		case 'load':
			await engine.loadFromUrl(proxyUrl(cellData.url));
			return { kind: 'text', text: 'Database loaded successfully.' };
	}
}
