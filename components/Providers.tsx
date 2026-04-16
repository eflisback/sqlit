'use client';

import type { ReactNode } from 'react';
import { ContextMenuProvider } from './context-menu/ContextMenuProvider';
import { ModalProvider } from './modal/ModalProvider';
import { ToastProvider } from './toast/ToastProvider';

export const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<ToastProvider>
			<ModalProvider>
				<ContextMenuProvider>{children}</ContextMenuProvider>
			</ModalProvider>
		</ToastProvider>
	);
};
