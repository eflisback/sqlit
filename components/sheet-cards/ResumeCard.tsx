'use client';

import { FaRotateLeft } from 'react-icons/fa6';
import { useSheetStore } from '@/lib';
import { QuickCard } from './QuickCard';

export function ResumeCard() {
	const hasCells = useSheetStore((state) => state.cells.length > 0);

	return (
		<QuickCard
			icon={FaRotateLeft}
			href='/sheet'
			name='Resume'
			description='Continue where you left off'
			disabled={!hasCells}
		/>
	);
}
