import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactCompiler: true,
	...(process.env.NEXT_OUTPUT === 'standalone' && { output: 'standalone' }),
	turbopack: {
		rules: {
			'*.md': { loaders: ['raw-loader'], as: '*.js' },
		},
	},
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
					{ key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
				],
			},
		];
	},
};

export default nextConfig;
