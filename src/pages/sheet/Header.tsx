import { useRef } from 'react';
import {
	FaFileExport,
	FaFileImport,
	FaGitAlt,
	FaMoon,
	FaShare,
	FaSun,
} from 'react-icons/fa6';
import { ShareModal, useModal, useTheme } from '@/components';
import { engine } from '@/engine';
import { readSheetFileMd, saveSheetMd, useSheetStore } from '@/store';
import { version } from '../../../package.json';
import styles from './Sheet.module.css';

export const Header = () => {
	const { openModal } = useModal();
	const { theme, setTheme } = useTheme();
	const cells = useSheetStore((state) => state.cells);
	const loadCells = useSheetStore((state) => state.loadCells);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleExport = () => {
		saveSheetMd(cells);
	};

	const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const imported = await readSheetFileMd(file);
			engine.reset();
			loadCells(imported);
		} catch (err) {
			alert(`Failed to import sheet: ${(err as Error).message}`);
		}
		e.target.value = '';
	};

	return (
		<header className={styles.header}>
			<section className={styles.logo}>
				<img src='/logo.svg' alt='sqlit logo' />
				<span>sqlit</span>
			</section>
			<section>
				<a
					className={styles.version}
					href='https://github.com/eflisback/sqlit'
					target='_blank'
					rel='noopener'
				>
					<FaGitAlt />
					<span>{version}</span>
				</a>
			</section>
			<section className={styles.buttons}>
				<button type='button' onClick={handleExport} title='Export sheet'>
					<FaFileExport />
					<span>Export</span>
				</button>
				<button type='button' onClick={() => fileInputRef.current?.click()}>
					<FaFileImport />
					<span>Import</span>
				</button>
				<button
					type='button'
					onClick={() => openModal('Share your sheet', <ShareModal />)}
					title='Share sheet'
				>
					<FaShare />
					<span>Share</span>
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
