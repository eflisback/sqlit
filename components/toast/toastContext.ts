import { type ComponentType, createContext } from 'react';

export interface ToastOptions {
	icon?: ComponentType;
	type?: 'info' | 'success' | 'error';
}

export interface ToastContextValue {
	addToast: (message: string, options?: ToastOptions) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
