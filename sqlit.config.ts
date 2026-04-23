import type { SqlitConfig } from '@/lib/types/config';

import pythonBasics from '@/sheets/python-basics.sqlit.md';
import pythonExercises from '@/sheets/python-exercises.sqlit.md';
import sqlBasics from '@/sheets/sql-basics.sqlit.md';
import sqlExercises from '@/sheets/sql-exercises.sqlit.md';
import welcomeSheet from '@/sheets/welcome.sqlit.md';

const config: SqlitConfig = {
	categories: [
		{
			name: 'Docs',
			sheets: [
				{
					name: 'Welcome to sqlit',
					description:
						'Run some SQL queries and Python code in the browser in this interactive introduction to sqlit.',
					markdown: welcomeSheet,
				},
			],
		},
		{
			name: 'Examples',
			sheets: [
				{
					name: 'SQL Basics',
					description: 'Introduction to databases with SQLite.',
					markdown: sqlBasics,
				},
				{
					name: 'SQL Exercises',
					description: 'Practice writing some SQL queries.',
					markdown: sqlExercises,
				},
				{
					name: 'Python Basics',
					description: 'Introduction to the Python programming language',
					markdown: pythonBasics,
				},
				{
					name: 'Python Exercises',
					description:
						'Practice writing some Python code that queries a database.',
					markdown: pythonExercises,
				},
			],
		},
	],
};

export default config;
