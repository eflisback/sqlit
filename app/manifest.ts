import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'sqlit',
		short_name: 'sqlit',
		description: 'An SQL notebook that runs entirely in the browser.',
		start_url: '/',
		display: 'standalone',
		background_color: '#0a0a0a',
		theme_color: '#7c3aff',
		icons: [{ src: '/logo.svg', sizes: 'any', type: 'image/svg+xml' }],
	};
}
