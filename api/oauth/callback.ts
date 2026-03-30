import type { VercelRequest, VercelResponse } from '@vercel/node';

function parseCookies(cookieHeader: string): Record<string, string> {
	return Object.fromEntries(
		cookieHeader.split(';').map((part) => {
			const [key, ...val] = part.trim().split('=');
			return [key, val.join('=')];
		}),
	);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const { code, state } = req.query;

	const cookies = parseCookies(req.headers.cookie ?? '');
	if (!state || state !== cookies.oauth_state) {
		res.status(400).send('Invalid state parameter');
		return;
	}

	res.setHeader(
		'Set-Cookie',
		'oauth_state=; HttpOnly; SameSite=Lax; Path=/api; Max-Age=0',
	);

	const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			client_id: process.env.OAUTH_CLIENT_ID,
			client_secret: process.env.OAUTH_CLIENT_SECRET,
			code,
		}),
	});

	const data = (await tokenRes.json()) as {
		access_token?: string;
		error?: string;
	};

	if (!data.access_token) {
		res.status(400).send(`OAuth error: ${data.error ?? 'unknown'}`);
		return;
	}

	res.setHeader('Content-Type', 'text/html');
	res.send(`<!DOCTYPE html>
<html>
<head><title>Authenticating…</title></head>
<body>
<script>
  const channel = new BroadcastChannel('oauth');
  channel.postMessage({ accessToken: ${JSON.stringify(data.access_token)} });
  channel.close();
  window.close();
</script>
</body>
</html>`);
}
