import { LandingScreen, Sheet } from './pages';
import { useSheetStore } from './store';

function App() {
	const hasStarted = useSheetStore((state) => state.hasStarted);

	return hasStarted ? <Sheet /> : <LandingScreen />;
}

export default App;
