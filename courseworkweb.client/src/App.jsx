import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Импорт маршрутизатора
import Header from './components/header/Header';
import HomePage from './components/homepage/HomePage';
import Clients from './components/clients/ClientApp';


function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/api/Clients" element={<Clients />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
