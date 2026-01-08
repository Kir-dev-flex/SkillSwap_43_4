import Header from '../widgets/header/Header';
import Footer from '../widgets/footer/Footer';
import FiltersPanel, { Filters } from '../widgets/FiltersPanel/FiltersPanel';
import { AppProvider } from './store/appProvider';

function App() {
  const handleFiltersChange = (filters: Filters) => {
    // eslint-disable-next-line no-console
    console.log('Filters changed:', filters);
  };

  return (
    <AppProvider>
      <Header />
      <main style={{ padding: '20px', display: 'flex', gap: '20px' }}>
        <FiltersPanel onChange={handleFiltersChange} />
        <div style={{ flex: 1 }}>
          <h2>Контент страницы</h2>
          <p>Здесь будет отображаться отфильтрованный контент</p>
        </div>
      </main>
      <Footer />
    </AppProvider>
  );
}

export default App;
