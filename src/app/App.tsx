import { AppProvider } from './store/appProvider';
import Router from './Router';

function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}

export default App;
