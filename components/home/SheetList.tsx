import Link from 'next/link';
import type { SheetConfig } from '@/sqlit.config';

interface Props {
	sheets: SheetConfig[];
}

export function SheetList({ sheets }: Props) {
	if (sheets.length === 0) {
		return (
			<p>
				No sheets configured. Edit <code>sqlit.config.ts</code> to add some.
			</p>
		);
	}
	return (
		<ul>
			{sheets.map((sheet) => (
				<li key={sheet.gistId}>
					<Link href={`/sheet?gist=${sheet.gistId}`}>
						<strong>{sheet.name}</strong>
					</Link>
					<p>{sheet.description}</p>
				</li>
			))}
		</ul>
	);
}
