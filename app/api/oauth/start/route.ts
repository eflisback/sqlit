import 'server-only';
import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';

export function GET(request: Request) {
	const state = randomBytes(16).toString('hex');

	const { headers } = request;
	const proto = headers.get('x-forwarded-proto') ?? 'http';
	const host = headers.get('x-forwarded-host') ?? headers.get('host');
	const redirectUri = `${proto}://${host}/api/oauth/callback`;

	const params = new URLSearchParams({
		client_id: process.env.OAUTH_CLIENT_ID ?? '',
		redirect_uri: redirectUri,
		scope: 'gist',
		state,
	});

	const response = NextResponse.redirect(
		`https://github.com/login/oauth/authorize?${params}`,
	);

	response.headers.set(
		'Set-Cookie',
		`oauth_state=${state}; HttpOnly; SameSite=Lax; Path=/api; Max-Age=300`,
	);

	return response;
}
