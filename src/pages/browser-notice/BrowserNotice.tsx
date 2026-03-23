import { FaArrowRight, FaTriangleExclamation } from 'react-icons/fa6';
import styles from './BrowserNotice.module.css';

interface BrowserNoticeProps {
	exitBrowserNotice: () => void;
}

export const BrowserNotice = ({ exitBrowserNotice }: BrowserNoticeProps) => {
	return (
		<main className={styles.browserNotice}>
			<div className={styles.panel}>
				<section className={styles.logo}>
					<img src='/logo.svg' alt='sqlit logo' />
					<span>sqlit</span>
				</section>
				<header>
					<FaTriangleExclamation />
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
			</div>
		</main>
	);
};
