import { SheetLoader } from '@/components/sheet/SheetLoader';

interface Props {
	searchParams: Promise<{ gist?: string; url?: string; blank?: string }>;
}

export default async function SheetPage({ searchParams }: Props) {
	const { gist, url, blank } = await searchParams;
	return <SheetLoader gistId={gist} remoteUrl={url} blank={blank !== undefined} />;
}
