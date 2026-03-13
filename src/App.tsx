import { useState } from 'react';
import { engine } from './engine/wrapper';

function App() {
	const [result, setResult] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const run = async () => {
		setLoading(true);
		try {
			const rows = await engine.query('SELECT sqlite_version() AS version');
			setResult(JSON.stringify(rows, null, 2));
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<button type='button' disabled={loading} onClick={run}>
				{loading ? 'Running...' : 'Run SQL'}
			</button>
			{result && <pre>{result}</pre>}
		</>
	);
}

export default App;
