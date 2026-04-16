'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { FaFileExport, FaFileImport, FaGitAlt, FaShare } from 'react-icons/fa6';
import { useModal } from '@/components/modal/useModal';
import { ShareModal } from '@/components/modal/share';
import { useExportSheet, useImportSheet } from '@/lib/hooks/useSheetFile';
import { version } from '../../package.json';
import styles from './Header.module.css';

export const Header = () => {
	const { openModal } = useModal();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const importSheet = useImportSheet();
	const exportSheet = useExportSheet();

	const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
		await importSheet(e.target.files?.[0]);
		e.target.value = '';
	};

	return (
		<header className={styles.header}>
			<section className={styles.logo}>
				<Image src={'/logo.svg'} width={32} height={32} alt='sqlit logo' />
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
				<button type='button' onClick={exportSheet} title='Export sheet'>
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
			</section>
		</header>
	);
};
