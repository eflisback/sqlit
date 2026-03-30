import type { ReactNode } from 'react';
import { FaXmark } from 'react-icons/fa6';
import styles from './Modal.module.css';

export const Modal = ({
	title,
	children,
	onClose,
}: {
	title: string;
	children: ReactNode;
	onClose: () => void;
}) => (
	<div
		className={styles.backdrop}
		role='dialog'
		onMouseDown={(e) => {
			if (e.target === e.currentTarget) onClose();
		}}
	>
		<div className={styles.modal}>
			<header>
				<span className={styles.modalTitle}>{title}</span>
				<button
					type='button'
					className={styles.closeButton}
					onClick={onClose}
					title='Close'
				>
					<FaXmark />
				</button>
			</header>
			{children}
		</div>
	</div>
);
