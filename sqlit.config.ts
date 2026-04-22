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
			],
		},
		{
			name: 'Examples',
			sheets: [
				{
					name: 'SQL Basics',
					description: 'Introduction to databases with SQLite.',
					fileUrl:
						'https://raw.githubusercontent.com/eflisback/sqlit/refs/heads/main/sheets/sql-basics.sqlit.md',
				},
				{
					name: 'SQL Exercises',
					description: 'Practice writing some SQL queries.',
					fileUrl:
						'https://raw.githubusercontent.com/eflisback/sqlit/refs/heads/main/sheets/sql-exercises.sqlit.md',
				},
				{
					name: 'Python Basics',
					description: 'Introduction to the Python programming language',
					fileUrl:
						'https://raw.githubusercontent.com/eflisback/sqlit/refs/heads/main/sheets/python-basics.sqlit.md',
				},
				{
					name: 'Python Exercises',
					description:
						'Practice writing some Python code that queries a database.',
					fileUrl:
						'https://raw.githubusercontent.com/eflisback/sqlit/refs/heads/main/sheets/python-exercises.sqlit.md',
				},
			],
		},
	],
};

export default config;
