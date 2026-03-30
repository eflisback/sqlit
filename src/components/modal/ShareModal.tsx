import { FaGithub } from 'react-icons/fa6';
import { useAuthStore } from '@/store';
import styles from './Modal.module.css';

export const ShareModal = () => {
	const accessToken = useAuthStore((state) => state.accessToken);

	return accessToken ? (
		<p>You are logged in.</p>
	) : (
		<>
			<p>Sign in with GitHub to create a sharable link using Gists.</p>
			<button
				type='button'
				className={styles.loginButton}
				onClick={() => {
					// TODO: redirect to GitHub OAuth
				}}
			>
				<FaGithub />
				Log in with GitHub
			</button>
		</>
	);
};
