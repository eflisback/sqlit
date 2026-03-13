import styles from './App.module.css';
import { Cell } from './components';
import { useNotebookStore } from './store';

function App() {
	const cells = useNotebookStore((state) => state.cells);

	return (
		<>
			<header>Header</header>
			<main className={styles.notebook}>
				{cells.map((cellData) => (
					<Cell key={cellData.id} cellData={cellData} />
				))}
			</main>
		</>
	);
}

export default App;
