import type { IconType } from 'react-icons';
import styles from './cells.module.css';

interface CellShellProps {
	Icon: IconType;
	label: string;
	information: string;
	children?: React.ReactNode;
}

export const CellShell = ({
	Icon,
	label,
	information,
	children,
}: CellShellProps) => (
	<article className={styles.cell}>
		<header>
			<section title={information}>
				<Icon />
				<span>{label}</span>
			</section>
		</header>
		{children}
	</article>
);
