'use client';

import {
	type CSSProperties,
	type ReactNode,
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { createPortal } from 'react-dom';
import type { IconType } from 'react-icons';
import {
	FaAngleRight,
	FaArrowDown,
	FaArrowTurnDown,
	FaArrowTurnUp,
	FaArrowUp,
	FaCopy,
	FaDatabase,
	FaFileArrowDown,
	FaFileCsv,
	FaMarkdown,
	FaPython,
	FaXmark,
} from 'react-icons/fa6';
import { useKey } from 'react-use';
import {
	history,
	InsertCellCommand,
	MoveCellCommand,
	RemoveCellCommand,
	useSheetStore,
} from '@/lib/store';
import { isExecutableCellData } from '@/lib/store/types';
import { tableToCsv, tableToMarkdown } from '@/lib/utils/result-formatters';
import { ContextMenuContext } from './contextMenuContext';
import styles from './ContextMenu.module.css';

interface ContextMenuState {
	cellId: string;
	x: number;
	y: number;
}

type MenuItem =
	| {
			type: 'action';
			icon?: IconType;
			label: string;
			disabled?: boolean;
			title?: string;
			onSelect: () => void;
	  }
	| {
			type: 'submenu';
			icon?: IconType;
			label: string;
			disabled?: boolean;
			title?: string;
			children: MenuItem[];
	  };

const Menu = ({
	items,
	style,
	menuRef,
}: {
	items: MenuItem[];
	style?: CSSProperties;
	menuRef?: RefObject<HTMLUListElement | null>;
}) => {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	return (
		<ul ref={menuRef} className={styles.menu} style={style}>
			{items.map((item, i) => (
				<li
					key={item.label}
					className={`${styles.item} ${item.type === 'submenu' ? styles.hasSubmenu : ''} ${item.disabled ? styles.disabled : ''}`}
					title={item.title}
					onMouseEnter={() =>
						item.type === 'submenu' && !item.disabled
							? setActiveIndex(i)
							: setActiveIndex(null)
					}
					onMouseLeave={() =>
						item.type === 'submenu' ? setActiveIndex(null) : undefined
					}
					onMouseDown={
						item.type === 'action' && !item.disabled ? item.onSelect : undefined
					}
				>
					{item.icon && <item.icon />}
					<span>{item.label}</span>
					{item.type === 'submenu' && (
						<FaAngleRight style={{ marginLeft: 'auto' }} />
					)}
					{item.type === 'submenu' && activeIndex === i && (
						<Menu items={item.children} />
					)}
				</li>
			))}
		</ul>
	);
};

const CellContextMenu = ({
	cellId,
	x,
	y,
	onClose,
}: ContextMenuState & { onClose: () => void }) => {
	const cells = useSheetStore((state) => state.cells);
	const menuRef = useRef<HTMLUListElement>(null);

	const cellIndex = cells.findIndex((c) => c.id === cellId);
	const cell = cells[cellIndex];
	const result =
		cell != null && isExecutableCellData(cell) ? cell.result : null;

	const copyItems: MenuItem[] = [];
	if (result?.kind === 'table') {
		copyItems.push({
			type: 'submenu',
			icon: FaCopy,
			label: 'Copy result',
			children: [
				{
					type: 'action',
					icon: FaMarkdown,
					label: 'As Markdown',
					onSelect: () => {
						navigator.clipboard.writeText(tableToMarkdown(result));
						onClose();
					},
				},
				{
					type: 'action',
					icon: FaFileCsv,
					label: 'As CSV',
					onSelect: () => {
						navigator.clipboard.writeText(tableToCsv(result));
						onClose();
					},
				},
			],
		});
	} else if (result?.kind === 'text') {
		copyItems.push({
			type: 'action',
			icon: FaCopy,
			label: 'Copy output',
			onSelect: () => {
				navigator.clipboard.writeText(result.text);
				onClose();
			},
		});
	} else if (result?.kind === 'error') {
		copyItems.push({
			type: 'action',
			icon: FaCopy,
			label: 'Copy error',
			onSelect: () => {
				navigator.clipboard.writeText(result.message);
				onClose();
			},
		});
	}

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				onClose();
			}
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, [onClose]);

	useKey('Escape', onClose);

	const handleMoveCellClick = (direction: 'up' | 'down') => {
		history.execute(new MoveCellCommand(cellId, direction));
		onClose();
	};

	const handleDeleteCellClick = () => {
		history.execute(new RemoveCellCommand(cellId));
		onClose();
	};

	const makeInsertItems = (
		insertIndex: number,
		markdownDisabled: boolean,
	): MenuItem[] => [
		{
			type: 'action',
			icon: FaMarkdown,
			label: 'Markdown',
			disabled: markdownDisabled,
			title: markdownDisabled
				? 'Adjacent to a Markdown cell (edit the existing one instead)'
				: undefined,
			onSelect: () => {
				history.execute(
					new InsertCellCommand(
						{ id: crypto.randomUUID(), type: 'markdown', content: '' },
						insertIndex,
					),
				);
				onClose();
			},
		},
		{
			type: 'action',
			icon: FaDatabase,
			label: 'SQL',
			onSelect: () => {
				history.execute(
					new InsertCellCommand(
						{ id: crypto.randomUUID(), type: 'sql', content: '', result: null },
						insertIndex,
					),
				);
				onClose();
			},
		},
		{
			type: 'action',
			icon: FaPython,
			label: 'Python',
			onSelect: () => {
				history.execute(
					new InsertCellCommand(
						{
							id: crypto.randomUUID(),
							type: 'python',
							content: '',
							result: null,
						},
						insertIndex,
					),
				);
				onClose();
			},
		},
		{
			type: 'action',
			icon: FaFileArrowDown,
			label: 'Load',
			onSelect: () => {
				history.execute(
					new InsertCellCommand(
						{ id: crypto.randomUUID(), type: 'load', url: '', result: null },
						insertIndex,
					),
				);
				onClose();
			},
		},
	];

	const aboveMarkdownDisabled =
		cells[cellIndex - 1]?.type === 'markdown' || cell?.type === 'markdown';
	const belowMarkdownDisabled =
		cell?.type === 'markdown' || cells[cellIndex + 1]?.type === 'markdown';

	const insertAboveItems = makeInsertItems(cellIndex, aboveMarkdownDisabled);
	const insertBelowItems = makeInsertItems(
		cellIndex + 1,
		belowMarkdownDisabled,
	);

	const items: MenuItem[] = [
		...copyItems,
		{
			type: 'action',
			label: 'Move cell upwards',
			icon: FaArrowUp,
			disabled: cellIndex === 0,
			title: cellIndex === 0 ? 'Cell is already at the top' : undefined,
			onSelect: () => handleMoveCellClick('up'),
		},
		{
			type: 'action',
			label: 'Move cell downwards',
			icon: FaArrowDown,
			disabled: cellIndex === cells.length - 1,
			title:
				cellIndex === cells.length - 1
					? 'Cell is already at the bottom'
					: undefined,
			onSelect: () => handleMoveCellClick('down'),
		},
		{
			type: 'submenu',
			label: 'Insert cell above',
			icon: FaArrowTurnUp,
			children: insertAboveItems,
		},
		{
			type: 'submenu',
			label: 'Insert cell below',
			icon: FaArrowTurnDown,
			children: insertBelowItems,
		},
		{
			type: 'action',
			label: 'Delete cell',
			icon: FaXmark,
			onSelect: () => handleDeleteCellClick(),
		},
	];

	return (
		<Menu
			menuRef={menuRef}
			items={items}
			style={{ position: 'absolute', top: y, left: x }}
		/>
	);
};

export const ContextMenuProvider = ({ children }: { children: ReactNode }) => {
	const [menuState, setMenuState] = useState<ContextMenuState | null>(null);

	const openMenu = useCallback((cellId: string, x: number, y: number) => {
		setMenuState({ cellId, x, y });
	}, []);

	const closeMenu = useCallback(() => {
		setMenuState(null);
	}, []);

	return (
		<ContextMenuContext.Provider value={{ openMenu, closeMenu }}>
			{children}
			{menuState &&
				createPortal(
					<CellContextMenu {...menuState} onClose={closeMenu} />,
					document.body,
				)}
		</ContextMenuContext.Provider>
	);
};
