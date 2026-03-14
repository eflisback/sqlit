import styles from './App.module.css';
import { Cell } from './components';
import { useNotebookStore } from './store';
import { useTheme } from './components';

function App() {
	const cells = useNotebookStore((state) => state.cells);
	const { theme, setTheme } = useTheme();

	return (
		<>
			<header>
				<button
					type='button'
					onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
				>
					{theme === 'light' ? 'Dark' : 'Light'} mode
				</button>
			</header>
			<main className={styles.notebook}>
				{cells.map((cellData) => (
					<Cell key={cellData.id} cellData={cellData} />
				))}
			</main>
		</>
	);
}

export default App;
