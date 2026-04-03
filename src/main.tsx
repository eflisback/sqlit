import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App.tsx';
import {
	ContextMenuProvider,
	ModalProvider,
	ThemeProvider,
	ToastProvider,
} from './components';

// biome-ignore lint/style/noNonNullAssertion: Root element set in index.html
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider>
			<ContextMenuProvider>
				<ToastProvider>
					<ModalProvider>
						<App />
					</ModalProvider>
				</ToastProvider>
			</ContextMenuProvider>
		</ThemeProvider>
	</StrictMode>,
);
