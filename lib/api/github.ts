const GITHUB_API = 'https://api.github.com';

const githubFetch = async (
	accessToken: string,
	path: string,
	options: RequestInit = {},
) => {
	const res = await fetch(`${GITHUB_API}${path}`, {
		...options,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
			'Content-Type': 'application/json',
			...options.headers,
		},
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`GitHub API error ${res.status}: ${text}`);
	}
	return res.json();
};

export const createGist = async (
	accessToken: string,
	content: string,
	name: string,
) => {
	const data = (await githubFetch(accessToken, '/gists', {
		method: 'POST',
		body: JSON.stringify({
			description: name,
			public: false,
			files: { 'sheet.sqlit.md': { content } },
		}),
	})) as { id: string; html_url: string };
	return { id: data.id, url: data.html_url };
};

export const updateGist = async (
	accessToken: string,
	gistId: string,
	content: string,
) => {
	const data = (await githubFetch(accessToken, `/gists/${gistId}`, {
		method: 'PATCH',
		body: JSON.stringify({
			files: { 'sheet.sqlit.md': { content } },
		}),
	})) as { id: string; html_url: string };
	return { id: data.id, url: data.html_url };
};

export const fetchGist = async (gistId: string) => {
	const res = await fetch(`${GITHUB_API}/gists/${gistId}`, {
		headers: {
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
		},
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`GitHub API error ${res.status}: ${text}`);
	}
	const data = (await res.json()) as {
		files: Record<string, { filename: string; raw_url: string }>;
	};
	const file = Object.values(data.files).find((f) =>
		f.filename.endsWith('.sqlit.md'),
	);
	if (!file) throw new Error('No .sqlit.md file found in gist');
	const raw = await fetch(file.raw_url);
	if (!raw.ok) throw new Error(`Failed to fetch gist content: ${raw.status}`);
	return raw.text();
};

export interface GistEntry {
	id: string;
	url: string;
	description: string;
	updatedAt: string;
}

export const listSqlitGists = async (
	accessToken: string,
): Promise<GistEntry[]> => {
	const data = (await githubFetch(
		accessToken,
		'/gists?per_page=100',
	)) as Array<{
		id: string;
		html_url: string;
		description: string;
		updated_at: string;
		files: Record<string, unknown>;
	}>;
	return data
		.filter((gist) =>
			Object.keys(gist.files).some((name) => name.endsWith('.sqlit.md')),
		)
		.map((gist) => ({
			id: gist.id,
			url: gist.html_url,
			description: gist.description,
			updatedAt: gist.updated_at,
		}));
};
