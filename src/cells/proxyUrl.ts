export function proxyUrl(url: string): string {
	try {
		const parsed = new URL(url);
		if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
			return `/api/proxy?url=${encodeURIComponent(url)}`;
		}
	} catch {}
	return url;
}
