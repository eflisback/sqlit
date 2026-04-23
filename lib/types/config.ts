type SheetBase = { name: string; description: string };

export type SheetConfig =
	| (SheetBase & { gistId: string; fileUrl?: never; markdown?: never })
	| (SheetBase & { fileUrl: string; gistId?: never; markdown?: never })
	| (SheetBase & { markdown: string; fileUrl?: never; gistId?: never });

export interface SheetCategory {
	name: string;
	sheets: SheetConfig[];
}

export interface SqlitConfig {
	categories: SheetCategory[];
}
