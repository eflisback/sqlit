import type { SqlitConfig } from '@/lib/types/config';

const config: SqlitConfig = {
	categories: [
		{
			name: 'Docs',
			sheets: [
				{
					name: 'Welcome to sqlit',
					description:
						'Run some SQL queries and Python code in the browser in this interactive introduction to sqlit.',
					fileUrl:
						'https://raw.githubusercontent.com/eflisback/sqlit/refs/heads/main/sheets/welcome.sqlit.md',
				},
				{
					name: 'Why sqlit?',
					description:
						'Who is this tool intended for? In what cases would you choose it over other, more established tools?',
					fileUrl: 'https://example.com/sheets/sales-dashboard.sqlit.md',
				},
				{
					name: 'Techy stuff',
					description:
						'Capabilities, limitations, and more technical details about sqlit and its dependencies.',
					fileUrl: 'https://example.com/sheets/user-analytics.sqlit.md',
				},
			],
		},
		{
			name: 'Examples',
			sheets: [
				{
					name: 'SQL Basics',
					description:
						'Introduction to databases with SQLite.',
					fileUrl: 'https://example.com/sheets/inventory-report.sqlit.md',
				},
				{
					name: 'SQL Exercises',
					description:
						'Practice writing some SQL queries.',
					fileUrl: 'https://example.com/sheets/log-bruh.sqlit.md',
				},
				{
					name: 'Python Basics',
					description: 'Introduction to the Python programming language',
					fileUrl: 'https://example.com/sheets/python.sqlit.md'
				},
				{
					name: 'Python Exercises',
					description:
						'Practice writing some SQL queries with Python.',
					fileUrl: 'https://example.com/sheets/log-explorer.sqlit.md',
				},
			],
		},
	],
};

export default config;
