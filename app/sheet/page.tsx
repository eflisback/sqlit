import { SheetLoader } from '@/components';
import { flatSheets } from '@/lib/utils/config';

interface Props {
	searchParams: Promise<{
		gist?: string;
		url?: string;
		blank?: string;
		local?: string;
	}>;
}

export default async function SheetPage({ searchParams }: Props) {
	const { gist, url, blank, local } = await searchParams;

	const inlineMarkdown = local && flatSheets()[Number(local)]?.markdown;

	return (
		<SheetLoader
			gistId={gist}
			remoteUrl={url}
			blank={blank !== undefined}
			markdown={inlineMarkdown}
		/>
	);
}
