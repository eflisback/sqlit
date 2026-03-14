import type { SqlResult } from '@/engine';

export type CellData =
	| {
			id: string;
			type: 'sql';
			content: string;
			result: SqlResult | null;
	  }
	| { id: string; type: 'markdown'; content: string }
	| { id: string; type: 'load'; url: string };
