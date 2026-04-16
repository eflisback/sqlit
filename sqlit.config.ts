export interface SheetConfig {
	name: string;
	description: string;
	gistId: string;
}

const config = {
	sheets: [] as SheetConfig[],
};

export default config;
