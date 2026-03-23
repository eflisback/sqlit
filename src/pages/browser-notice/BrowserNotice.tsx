import { isDesktop, isMobile } from 'react-device-detect';
import { FaArrowRight, FaTriangleExclamation } from 'react-icons/fa6';
import styles from './BrowserNotice.module.css';

interface BrowserNoticeProps {
	exitBrowserNotice: () => void;
}

const content = (exitBrowserNotice: () => void) => (
	<>
		<section className={styles.logo}>
			<img src='/logo.svg' alt='sqlit logo' />
			<span>sqlit</span>
		</section>
		<header className={styles.noticeHeader}>
			{isDesktop && <FaTriangleExclamation />}
			<span>Browser not fully supported</span>
		</header>
		<section className={styles.content}>
			<p>
				Your browser lacks some required functionality for handling{' '}
				<code>input()</code> prompts in Python snippets.
			</p>
			<p>
				For full functionality, use <b>Chrome</b>, <b>Edge</b>, or{' '}
				<b>Firefox</b> on desktop.
			</p>
			<button type='button' onClick={exitBrowserNotice}>
				<FaArrowRight />
				<span>Continue anyway</span>
			</button>
		</section>
	</>
);

export const BrowserNotice = ({ exitBrowserNotice }: BrowserNoticeProps) => {
	if (isMobile) {
		return (
			<main className={styles.mobilePage}>{content(exitBrowserNotice)}</main>
		);
	}

	return (
		<main className={styles.browserNotice}>
			<div className={styles.panel}>{content(exitBrowserNotice)}</div>
		</main>
	);
};
