import { createContext, useContext } from 'react';

interface ContextMenuContextValue {
	openMenu: (cellId: string, x: number, y: number) => void;
	closeMenu: () => void;
}

export const ContextMenuContext = createContext<ContextMenuContextValue | null>(
	null,
);

export const useContextMenu = () => {
	const ctx = useContext(ContextMenuContext);
	if (!ctx)
		throw new Error('useContextMenu must be used within ContextMenuProvider');
	return ctx;
};
