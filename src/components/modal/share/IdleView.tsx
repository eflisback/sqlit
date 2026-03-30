import { useState } from 'react';
import { FaLink } from 'react-icons/fa6';
import styles from '../Modal.module.css';

interface Props {
	sharedGistId: string | null;
	error: string | null;
	onCreateGist: (name: string) => void;
	onOverwritePrevious: () => void;
	onPickGist: () => void;
	onLogout: () => void;
}

export const IdleView = ({
	sharedGistId,
	error,
	onCreateGist,
	onOverwritePrevious,
	onPickGist,
	onLogout,
}: Props) => {
	const [name, setName] = useState('');

	return (
		<>
			{error && <p className={styles.errorText}>{error}</p>}
			{sharedGistId ? (
				<>
					<p className={styles.noticeText}>
						An earlier version of this sheet was shared.
					</p>
					<button
						type='button'
						className={styles.loginButton}
						onClick={onOverwritePrevious}
					>
						Overwrite gist
					</button>
					<input
						type='text'
						className={styles.nameInput}
						placeholder='Gist name'
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<button
						type='button'
						className={styles.loginButton}
						disabled={name.trim() === ''}
						onClick={() => onCreateGist(name.trim())}
					>
						Share with new link
					</button>
					<button
						type='button'
						className={styles.textButton}
						onClick={onPickGist}
					>
						Choose a different gist to overwrite
					</button>
				</>
			) : (
				<>
					<p>Name your sheet and generate a new shareable link.</p>
					<div className={styles.inputRow}>
						<input
							type='text'
							className={styles.nameInput}
							placeholder='Gist name'
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<button
							type='button'
							className={styles.wideButton}
							disabled={name.trim() === ''}
							onClick={() => onCreateGist(name.trim())}
						>
							<FaLink />
							<span>Get link</span>
						</button>
					</div>
					<div className={styles.divider}>
						<span>or</span>
					</div>
					<button
						type='button'
						className={styles.loginButton}
						onClick={onPickGist}
					>
						Overwrite existing Gist
					</button>
				</>
			)}
			<button type='button' className={styles.textButton} onClick={onLogout}>
				Log out
			</button>
		</>
	);
};
