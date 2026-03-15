import { FaMoon, FaSun } from 'react-icons/fa6';
import { useTheme } from '@/components';
import styles from './Sheet.module.css';

export const Header = () => {
	const { theme, setTheme } = useTheme();

	return (
		<header className={styles.header}>
			<button
				type='button'
				onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
			>
				{theme === 'light' ? <FaMoon /> : <FaSun />}
			</button>
		</header>
	);
};
