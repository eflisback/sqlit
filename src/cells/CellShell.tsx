import type { IconType } from 'react-icons';
import { useContextMenu } from '@/components';
import { useSheetStore } from '@/store';
import styles from './cells.module.css';
import type { CellStatus } from './types';

interface CellShellProps {
	Icon: IconType;
	label: string;
	information: string;
	cellId: string;
	isLoading?: boolean;
	status?: CellStatus;
	children?: React.ReactNode;
}

export const CellShell = ({
	Icon,
	label,
	information,
	cellId,
	isLoading,
	status,
	children,
}: CellShellProps) => {
	const setEditableCellId = useSheetStore((state) => state.setEditalbeCellId);
	const { openMenu } = useContextMenu();
	const statusClass = isLoading ? styles.loading : status ? styles[status] : '';

	const makeEditable = () => {
		setEditableCellId(cellId);
	};

	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		openMenu(cellId, e.pageX, e.pageY);
	};

	return (
		<article
			className={`${styles.cell} ${statusClass}`.trim()}
			onDoubleClick={makeEditable}
			onContextMenu={handleContextMenu}
		>
			<header>
				<section className={styles.information} title={information}>
					<Icon />
					<span className={isLoading ? styles.shimmer : undefined}>
						{label}
					</span>
				</section>
			</header>
			{children}
		</article>
	);
};
