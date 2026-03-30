import { FaFileExport, FaGithub } from 'react-icons/fa6';
import styles from '../Modal.module.css';

interface Props {
	onLogin: () => void;
	onExportFile: () => void;
}

export const LoginView = ({ onLogin, onExportFile }: Props) => {
	return (
		<>
			<p>
				Log in with GitHub to create a shareable link (uses{' '}
				<a href='https://gist.github.com/' target='_blank' rel='noopener'>
					Gists
				</a>{' '}
				under the hood).
			</p>
			<button type='button' className={styles.wideButton} onClick={onLogin}>
				<FaGithub />
				<span>Log in with GitHub</span>
			</button>
			<div className={styles.divider}>
				<span>or</span>
			</div>
			<p>
				Simply download your sheet as a <code>.sqlit.md</code> file and
				distribute it how you want.
			</p>
			<button
				type='button'
				className={styles.wideButton}
				onClick={onExportFile}
			>
				<FaFileExport />
				<span>Export as file</span>
			</button>
		</>
	);
};
