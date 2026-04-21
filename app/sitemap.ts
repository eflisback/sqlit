import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://sqlit.ebbe.dev';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{ url: BASE_URL, priority: 1 },
		{ url: `${BASE_URL}/sheet`, priority: 0.8 },
	];
}
