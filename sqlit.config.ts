import type { SqlitConfig } from '@/lib/types/config';

const config: SqlitConfig = {
	sheets: [
		{
			name: 'Welcome to sqlit',
			description: '',
			source: {
				type: 'url',
				url: 'https://raw.githubusercontent.com/eflisback/sqlit/8070c3dfc1f5b04cbc1713e9d8d025fe1ee867cd/src/store/welcome.sqlit.md'
			}
		}
	],
};

export default config;
