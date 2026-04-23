import config from '@/sqlit.config';

export function flatSheets() {
	return config.categories.flatMap((cat) => cat.sheets);
}
