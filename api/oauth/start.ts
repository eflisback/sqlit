import { randomBytes } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
	const state = randomBytes(16).toString('hex');

	const proto = req.headers['x-forwarded-proto'] ?? 'http';
	const host = req.headers['x-forwarded-host'] ?? req.headers.host;
	const redirectUri = `${proto}://${host}/api/oauth/callback`;

	res.setHeader(
		'Set-Cookie',
		`oauth_state=${state}; HttpOnly; SameSite=Lax; Path=/api; Max-Age=300`,
	);

	const params = new URLSearchParams({
		client_id: process.env.OAUTH_CLIENT_ID ?? '',
		redirect_uri: redirectUri,
		scope: 'gist',
		state,
	});

	res.redirect(302, `https://github.com/login/oauth/authorize?${params}`);
}
