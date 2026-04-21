import type { SqlitConfig } from '@/lib/types/config';

const config: SqlitConfig = {
	sheets: [
		{
			name: 'Welcome to sqlit',
			description:
				'Run some SQL queries and Python code in the browser in this interactive introduction to sqlit.',
			source: {
				type: 'url',
				url: 'https://raw.githubusercontent.com/eflisback/sqlit/refs/heads/main/sheets/welcome.sqlit.md',
			},
		},
	],
};

export default config;
