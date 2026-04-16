'use client';

import {
	type ComponentType,
	type ReactNode,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './Toast.module.css';
import { ToastContext, type ToastOptions } from './toastContext';

interface Toast {
	id: string;
	message: string;
	icon?: ComponentType;
	type: 'info' | 'success' | 'error';
}

const TOAST_DURATION = 3000;
const EXIT_DURATION = 150;

function ToastItem({
	toast,
	exiting,
	onRemove,
}: {
	toast: Toast;
	exiting: boolean;
	onRemove: (id: string) => void;
}) {
	useEffect(() => {
		const timer = setTimeout(() => onRemove(toast.id), TOAST_DURATION);
		return () => clearTimeout(timer);
	}, [toast.id, onRemove]);

	return (
		<div
			className={`${styles.toast} ${styles[toast.type]} ${exiting ? styles.exiting : ''}`}
		>
			{toast.icon && (
				<span className={styles.toastIcon}>
					<toast.icon />
				</span>
			)}
			<span>{toast.message}</span>
		</div>
	);
}

function ToastContainer({
	toasts,
	exitingIds,
	onRemove,
}: {
	toasts: Toast[];
	exitingIds: Set<string>;
	onRemove: (id: string) => void;
}) {
	if (toasts.length === 0) return null;
	return createPortal(
		<div className={styles.container}>
			{toasts.map((toast) => (
				<ToastItem
					key={toast.id}
					toast={toast}
					exiting={exitingIds.has(toast.id)}
					onRemove={onRemove}
				/>
			))}
		</div>,
		document.body,
	);
}

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);
	const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());

	const removeToast = useCallback((id: string) => {
		setExitingIds((prev) => new Set(prev).add(id));
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
			setExitingIds((prev) => {
				const next = new Set(prev);
				next.delete(id);
				return next;
			});
		}, EXIT_DURATION);
	}, []);

	const addToast = useCallback((message: string, options?: ToastOptions) => {
		const id = crypto.randomUUID();
		setToasts((prev) => [
			...prev,
			{ id, message, icon: options?.icon, type: options?.type ?? 'info' },
		]);
	}, []);

	return (
		<ToastContext.Provider value={{ addToast }}>
			{children}
			<ToastContainer
				toasts={toasts}
				exitingIds={exitingIds}
				onRemove={removeToast}
			/>
		</ToastContext.Provider>
	);
}
