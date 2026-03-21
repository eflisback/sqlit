import { z } from 'zod';

const sqlCellSchema = z.object({
	id: z.string(),
	type: z.literal('sql'),
	content: z.string(),
});
const pythonCellSchema = z.object({
	id: z.string(),
	type: z.literal('python'),
	content: z.string(),
});
const loadCellSchema = z.object({
	id: z.string(),
	type: z.literal('load'),
	url: z.string(),
});
const markdownCellSchema = z.object({
	id: z.string(),
	type: z.literal('markdown'),
	content: z.string(),
});

const cellSchema = z.discriminatedUnion('type', [
	sqlCellSchema,
	pythonCellSchema,
	loadCellSchema,
	markdownCellSchema,
]);

export const sheetFileSchema = z.object({
	version: z.literal(1),
	cells: z.array(cellSchema),
});
export type SheetFile = z.infer<typeof sheetFileSchema>;
