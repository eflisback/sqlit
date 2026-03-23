import { useState } from 'react';
import { BrowserNotice, Sheet } from './pages';

function App() {
	const [browserNotice, setBrowserNotice] = useState(
		!window.crossOriginIsolated,
	);

	const exitBrowserNotice = () => {
		setBrowserNotice(false);
	};

	return browserNotice ? (
		<BrowserNotice exitBrowserNotice={exitBrowserNotice} />
	) : (
		<Sheet />
	);
}

export default App;
