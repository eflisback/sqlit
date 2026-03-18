import type { IconType } from 'react-icons';
import { FaPlay } from 'react-icons/fa6';
import styles from './cells.module.css';
import type { CellStatus } from './types';

interface ExecutableCellShellProps {
	Icon: IconType;
	label: string;
	information: string;
	isLoading: boolean;
	status: CellStatus;
	children?: React.ReactNode;
}

export const ExecutableCellShell = ({
	Icon,
	label,
	information,
	isLoading,
	status,
	children,
}: ExecutableCellShellProps) => (
	<article
		className={`${styles.cell} ${isLoading ? styles.loading : styles[status]}`}
	>
		<header>
			<section title={information}>
				<Icon />
				<span className={isLoading ? styles.shimmer : undefined}>{label}</span>
			</section>
		</header>
		{children}
	</article>
);

interface RunButtonProps {
	isLoading: boolean;
	onClick: () => void;
}

export const RunButton = ({ isLoading, onClick }: RunButtonProps) => (
	<section className={styles.actions}>
		<button type='button' onClick={onClick} disabled={isLoading}>
			<FaPlay />
			<span className={isLoading ? styles.shimmer : undefined}>
				{isLoading ? 'Running...' : 'Execute snippet'}
			</span>
		</button>
	</section>
);
