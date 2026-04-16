'use client';

import { createContext, type ReactNode, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { useKey } from 'react-use';
import { Modal } from './Modal';

interface ModalState {
	title: string;
	content: ReactNode;
}

interface ModalContextValue {
	openModal: (title: string, content: ReactNode) => void;
	closeModal: () => void;
}

export const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [modal, setModal] = useState<ModalState | null>(null);

	const openModal = useCallback(
		(title: string, content: ReactNode) => setModal({ title, content }),
		[],
	);
	const closeModal = useCallback(() => setModal(null), []);

	useKey('Escape', closeModal);

	return (
		<ModalContext.Provider value={{ openModal, closeModal }}>
			{children}
			{modal != null &&
				createPortal(
					<Modal title={modal.title} onClose={closeModal}>
						{modal.content}
					</Modal>,
					document.body,
				)}
		</ModalContext.Provider>
	);
};
