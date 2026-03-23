import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const { url } = req.query;

	if (!url || typeof url !== 'string') {
		return res.status(400).json({ error: 'Missing url parameter' });
	}

	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		return res
			.status(400)
			.json({ error: 'Only http and https URLs are allowed' });
	}

	const upstream = await fetch(url);

	const contentType = upstream.headers.get('content-type');
	if (contentType) {
		res.setHeader('Content-Type', contentType);
	}
	res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Cache-Control', 'public, max-age=3600');

	const buffer = await upstream.arrayBuffer();
	res.status(upstream.status).send(Buffer.from(buffer));
}
