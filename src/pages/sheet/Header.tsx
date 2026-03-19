import { FaEye, FaMoon, FaPen, FaSun } from 'react-icons/fa6';
import { useTheme } from '@/components';
import { useSheetStore } from '@/store';
import styles from './Sheet.module.css';

export const Header = () => {
	const { theme, setTheme } = useTheme();
	const isEditable = useSheetStore((state) => state.isEditable);
	const setIsEditable = useSheetStore((state) => state.setIsEditable);

	return (
		<header className={styles.header}>
			<button
				type='button'
				onClick={() => setIsEditable(!isEditable)}
				title={isEditable ? 'Enter viewing mode' : 'Enter editing mode'}
			>
				{isEditable ? <FaEye /> : <FaPen />}
			</button>
			<button
				type='button'
				onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
				title='Toggle theme'
			>
				{theme === 'light' ? <FaMoon /> : <FaSun />}
			</button>
		</header>
	);
};
