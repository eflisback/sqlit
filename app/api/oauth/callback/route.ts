import 'server-only';

function parseCookies(cookieHeader: string): Record<string, string> {
	return Object.fromEntries(
		cookieHeader.split(';').map((part) => {
			const [key, ...val] = part.trim().split('=');
			return [key, val.join('=')];
		}),
	);
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get('code');
	const state = searchParams.get('state');

	const cookies = parseCookies(request.headers.get('cookie') ?? '');
	if (!state || state !== cookies.oauth_state) {
		return new Response('Invalid state parameter', { status: 400 });
	}

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
		return new Response(`OAuth error: ${data.error ?? 'unknown'}`, {
			status: 400,
		});
	}

	const html = `<!DOCTYPE html>
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
</html>`;

	return new Response(html, {
		headers: {
			'Content-Type': 'text/html',
			'Set-Cookie':
				'oauth_state=; HttpOnly; SameSite=Lax; Path=/api; Max-Age=0',
		},
	});
}
