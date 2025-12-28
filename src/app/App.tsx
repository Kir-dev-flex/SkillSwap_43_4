import Header from '../widgets/header/Header';
import Footer from '../widgets/footer/Footer';
import { AppProvider } from './store/appProvider';

function App() {
  return (
    <AppProvider>
      <Header />
      <Footer />
    </AppProvider>
  );
}

export default App;
