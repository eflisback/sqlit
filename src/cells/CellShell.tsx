import type { IconType } from 'react-icons';
import { FaAnglesDown, FaAnglesUp, FaTrash } from 'react-icons/fa6';
import { useSheetStore } from '@/store';
import styles from './cells.module.css';
import type { CellStatus } from './types';

interface CellShellProps {
	Icon: IconType;
	label: string;
	information: string;
	cellId: string;
	isFirst: boolean;
	isLast: boolean;
	isLoading?: boolean;
	status?: CellStatus;
	children?: React.ReactNode;
}

export const CellShell = ({
	Icon,
	label,
	information,
	cellId,
	isFirst,
	isLast,
	isLoading,
	status,
	children,
}: CellShellProps) => {
	const isEditable = useSheetStore((state) => state.isEditable);
	const moveCell = useSheetStore((state) => state.moveCell);
	const removeCell = useSheetStore((state) => state.removeCell);
	const statusClass = isLoading ? styles.loading : status ? styles[status] : '';

	return (
		<article className={`${styles.cell} ${statusClass}`.trim()}>
			<header>
				<section className={styles.information} title={information}>
					<Icon />
					<span className={isLoading ? styles.shimmer : undefined}>
						{label}
					</span>
				</section>
				{isEditable && (
					<section className={styles.editButtons}>
						{!isFirst && (
							<button
								type='button'
								title='Move up'
								onClick={() => moveCell(cellId, 'up')}
							>
								<FaAnglesUp />
							</button>
						)}
						{!isLast && (
							<button
								type='button'
								title='Move down'
								onClick={() => moveCell(cellId, 'down')}
							>
								<FaAnglesDown />
							</button>
						)}
						<button
							type='button'
							title='Delete cell'
							onClick={() => removeCell(cellId)}
						>
							<FaTrash />
						</button>
					</section>
				)}
			</header>
			{children}
		</article>
	);
};
