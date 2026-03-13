import type { SqlResult } from '@/engine';

export type CellData =
	| {
			id: string;
			type: 'sql';
			content: string;
			editable: boolean;
			result: SqlResult | null;
	  }
	| { id: string; type: 'markdown'; content: string };
