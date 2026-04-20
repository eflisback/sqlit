'use client';

import Link from 'next/link';
import type { SheetConfig } from '@/lib/types/config';
import { useSheetStore } from '@/lib/store';

interface Props {
	sheets: SheetConfig[];
}

function sheetHref(sheet: SheetConfig): string {
	switch (sheet.source.type) {
		case 'gist':
			return `/sheet?gist=${sheet.source.gistId}`;
		case 'url':
			return `/sheet?url=${encodeURIComponent(sheet.source.url)}`;
	}
}

function sheetKey(sheet: SheetConfig): string {
	switch (sheet.source.type) {
		case 'gist':
			return sheet.source.gistId;
		case 'url':
			return sheet.source.url;
	}
}

export function SheetList({ sheets }: Props) {
	const hasCells = useSheetStore((state) => state.cells.length > 0);

	return (
		<ul>
			{hasCells && (
				<li>
					<Link href='/sheet'>
						<strong>Resume last sheet</strong>
					</Link>
					<p>Continue where you left off</p>
				</li>
			)}
			{sheets.map((sheet) => (
				<li key={sheetKey(sheet)}>
					<Link href={sheetHref(sheet)}>
						<strong>{sheet.name}</strong>
					</Link>
					<p>{sheet.description}</p>
				</li>
			))}
			<li>
				<Link href='/sheet?blank'>
					<strong>Create blank sheet</strong>
				</Link>
				<p>Start with a fresh, empty sheet</p>
			</li>
		</ul>
	);
}
