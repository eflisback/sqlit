type SheetBase = { name: string; description: string };

export type SheetConfig =
	| (SheetBase & { gistId: string; fileUrl?: never })
	| (SheetBase & { fileUrl: string; gistId?: never });

export interface SheetCategory {
	name: string;
	sheets: SheetConfig[];
}

export interface SqlitConfig {
	categories: SheetCategory[];
}
