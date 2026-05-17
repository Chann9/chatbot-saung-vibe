import { AppContextProvider } from './context/AppContext';
import { AppRouter } from './Router';
import './App.css';

function App() {
  return (
    <AppContextProvider>
      <AppRouter />
    </AppContextProvider>
  );
}

export default App;

