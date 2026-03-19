import type { IconType } from 'react-icons';
import { FaForward, FaPlay } from 'react-icons/fa6';
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
	disabled: boolean;
	onClick: () => void;
}

export const RunButton = ({ isLoading, disabled, onClick }: RunButtonProps) => (
	<button type='button' onClick={onClick} disabled={disabled}>
		<FaPlay />
		<span className={isLoading ? styles.shimmer : undefined}>
			{isLoading ? 'Running...' : 'Run cell'}
		</span>
	</button>
);

interface RunWithPriorButtonProps {
	disabled: boolean;
	onClick: () => void;
}

export const RunWithPriorButton = ({
	disabled,
	onClick,
}: RunWithPriorButtonProps) => (
	<button type='button' onClick={onClick} disabled={disabled}>
		<FaForward />
		<span>Run to here</span>
	</button>
);
