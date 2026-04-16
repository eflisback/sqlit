import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactCompiler: true,
	...(process.env.NEXT_OUTPUT === 'standalone' && { output: 'standalone' }),
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
