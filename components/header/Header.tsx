'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRef } from 'react';
import { FaFileExport, FaFileImport, FaGitAlt, FaShare } from 'react-icons/fa6';
import { useExportSheet, useImportSheet } from '@/lib';
import { useModal } from '../modal/useModal';
import { ShareModal } from '../modal/share/ShareModal';
import { version } from '../../package.json';
import styles from './Header.module.css';

export const Header = () => {
	const pathname = usePathname();
	const router = useRouter();
	const { openModal } = useModal();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const importSheet = useImportSheet();
	const exportSheet = useExportSheet();
	const isHome = pathname === '/';

	const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
		await importSheet(e.target.files?.[0]);
		e.target.value = '';
		if (isHome) router.push('/sheet');
	};

	return (
		<header className={styles.header}>
			<section>
				<Link href='/' className={styles.logoLink}>
					<Image
						src={'/logo.svg'}
						width={32}
						height={32}
						alt='sqlit logo'
						priority
					/>
					<span>sqlit</span>
				</Link>
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
				{!isHome && (
					<button type='button' onClick={exportSheet} title='Export sheet'>
						<FaFileExport />
						<span>Export</span>
					</button>
				)}
				<button type='button' onClick={() => fileInputRef.current?.click()}>
					<FaFileImport />
					<span>Import</span>
				</button>
				{!isHome && (
					<button
						type='button'
						onClick={() => openModal('Share your sheet', <ShareModal />)}
						title='Share sheet'
					>
						<FaShare />
						<span>Share</span>
					</button>
				)}
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
