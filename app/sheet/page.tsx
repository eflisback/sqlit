import { SheetLoader } from '@/components/sheet/SheetLoader';

interface Props {
	searchParams: Promise<{ gist?: string }>;
}

export default async function SheetPage({ searchParams }: Props) {
	const { gist } = await searchParams;
	return <SheetLoader gistId={gist ?? null} />;
}
