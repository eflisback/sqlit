import { useRef } from 'react';
import {
	FaEye,
	FaFileExport,
	FaFileImport,
	FaMoon,
	FaPen,
	FaSun,
} from 'react-icons/fa6';
import { useTheme } from '@/components';
import { exportSheet, importSheet, useSheetStore } from '@/store';
import styles from './Sheet.module.css';

export const Header = () => {
	const { theme, setTheme } = useTheme();
	const isEditable = useSheetStore((state) => state.isEditable);
	const setIsEditable = useSheetStore((state) => state.setIsEditable);
	const cells = useSheetStore((state) => state.cells);
	const loadCells = useSheetStore((state) => state.loadCells);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleExport = () => {
		const json = exportSheet(cells);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'sheet.json';
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const imported = importSheet(reader.result as string);
				loadCells(imported);
			} catch {
				alert('Failed to import sheet: invalid or malformed file.');
			}
		};
		reader.readAsText(file);
		e.target.value = '';
	};

	return (
		<header className={styles.header}>
			<button type='button' onClick={handleExport} title='Export sheet'>
				<FaFileExport />
				<span>Export sheet</span>
			</button>
			<button type='button' onClick={() => fileInputRef.current?.click()}>
				<FaFileImport />
				<span>Import sheet</span>
			</button>
			<input
				ref={fileInputRef}
				type='file'
				accept='.json'
				style={{ display: 'none' }}
				onChange={handleImport}
			/>
			<button type='button' onClick={() => setIsEditable(!isEditable)}>
				{isEditable ? (
					<>
						<FaEye />
						<span>View mode</span>
					</>
				) : (
					<>
						<FaPen />
						<span>Edit mode</span>
					</>
				)}
			</button>
			<button
				type='button'
				onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
				title='Toggle theme'
			>
				{theme === 'light' ? <FaMoon /> : <FaSun />}
			</button>
		</header>
	);
};
