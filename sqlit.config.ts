import type { SqlitConfig } from '@/lib/types/config';

const config: SqlitConfig = {
	categories: [
		{
			name: 'Introduction',
			sheets: [
				{
					name: 'Welcome to sqlit',
					description:
						'Run some SQL queries and Python code in the browser in this interactive introduction to sqlit.',
					fileUrl:
						'https://raw.githubusercontent.com/eflisback/sqlit/refs/heads/main/sheets/welcome.sqlit.md',
				},
				{
					name: 'Sales Dashboard',
					description:
						'Explore regional sales trends and product performance metrics across quarters.',
					fileUrl: 'https://example.com/sheets/sales-dashboard.sqlit.md',
				},
				{
					name: 'User Analytics',
					description:
						'Query user retention, session data, and funnel drop-off rates over time.',
					fileUrl: 'https://example.com/sheets/user-analytics.sqlit.md',
				},
			],
		},
		{
			name: 'Operations',
			sheets: [
				{
					name: 'Inventory Report',
					description:
						'Track stock levels, reorder points, and supplier lead times in real time.',
					fileUrl: 'https://example.com/sheets/inventory-report.sqlit.md',
				},
				{
					name: 'Log Explorer',
					description:
						'Dig into application logs to surface errors, slowdowns, and anomalies.',
					fileUrl: 'https://example.com/sheets/log-explorer.sqlit.md',
				},
				{
					name: 'Finance Overview',
					description:
						'Month-over-month revenue, expenses, and margin breakdown by department.',
					fileUrl: 'https://example.com/sheets/finance-overview.sqlit.md',
				},
			],
		},
	],
};

export default config;
