import { useState } from 'react';
import Header from '../widgets/header/Header';
import Footer from '../widgets/footer/Footer';

import InputWithCalendar from '../shared/ui/inputWithCalendar/InputWithCalendar';

function App() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleToggleCalendar = (open: boolean) => {
    setIsCalendarOpen(open);
  };

  return (
    <div className='app'>
      <Header />

      <div style={{ padding: 50 }}>
        <InputWithCalendar
          isOpen={isCalendarOpen}
          onToggle={handleToggleCalendar}
          onChange={handleDateChange}
          value={selectedDate}
        />
      </div>

      <Footer />
    </div>
  );
}

export default App;
