export type SheetSource =
	| { type: 'gist'; gistId: string }
	| { type: 'url'; url: string };

export interface SheetConfig {
	name: string;
	description: string;
	source: SheetSource;
}

export interface SqlitConfig {
	sheets: SheetConfig[];
}
