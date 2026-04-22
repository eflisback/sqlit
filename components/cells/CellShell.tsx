'use client';

import { forwardRef } from 'react';
import type { IconType } from 'react-icons';
import { useContextMenu } from '../context-menu/contextMenuContext';
import { useSheetStore } from '@/lib';
import styles from './cells.module.css';
import type { CellStatus } from './types';

interface CellShellProps {
	Icon: IconType;
	label: string;
	information: string;
	cellId: string;
	isLoading?: boolean;
	status?: CellStatus;
	hideHeader?: boolean;
	children?: React.ReactNode;
}

export const CellShell = forwardRef<HTMLElement, CellShellProps>(
	(
		{
			Icon,
			label,
			information,
			cellId,
			isLoading,
			status,
			hideHeader,
			children,
		},
		ref,
	) => {
		const setEditableCellId = useSheetStore((state) => state.setEditalbeCellId);
		const { openMenu } = useContextMenu();
		const statusClass = isLoading
			? styles.loading
			: status
				? styles[status]
				: '';

		const makeEditable = () => {
			setEditableCellId(cellId);
		};

		const handleContextMenu = (e: React.MouseEvent) => {
			e.preventDefault();
			openMenu(cellId, e.pageX, e.pageY);
		};

		return (
			<article
				ref={ref}
				className={`${styles.cell} ${statusClass}`.trim()}
				onDoubleClick={makeEditable}
				onContextMenu={handleContextMenu}
			>
				{!hideHeader && (
					<header>
						<section className={styles.information} title={information}>
							<Icon />
							<span className={isLoading ? styles.shimmer : undefined}>
								{label}
							</span>
						</section>
					</header>
				)}
				{children}
			</article>
		);
	},
);
