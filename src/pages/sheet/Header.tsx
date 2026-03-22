import { useRef } from 'react';
import {
	FaFileExport,
	FaFileImport,
	FaGitAlt,
	FaMoon,
	FaSun,
} from 'react-icons/fa6';
import { useTheme } from '@/components';
import { exportSheetMd, importSheetMd, useSheetStore } from '@/store';
import { version } from '../../../package.json';
import styles from './Sheet.module.css';

export const Header = () => {
	const { theme, setTheme } = useTheme();
	const cells = useSheetStore((state) => state.cells);
	const loadCells = useSheetStore((state) => state.loadCells);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleExport = () => {
		const md = exportSheetMd(cells);
		const blob = new Blob([md], { type: 'text/markdown' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'sheet.sqlit.md';
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const imported = importSheetMd(reader.result as string);
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
			<section className={styles.logo}>
				<img src='/logo.svg' alt='sqlit logo' />
				<span>sqlit</span>
			</section>
			<section className={styles.version}>
				<FaGitAlt />
				<span>{version}</span>
			</section>
			<section className={styles.buttons}>
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
					accept='.sqlit.md'
					style={{ display: 'none' }}
					onChange={handleImport}
				/>
				<button
					type='button'
					onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
					title='Toggle theme'
				>
					{theme === 'light' ? <FaMoon /> : <FaSun />}
				</button>
			</section>
		</header>
	);
};
