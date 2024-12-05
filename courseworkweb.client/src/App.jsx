import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import HomePage from './components/homepage/HomePage';
import Clients from './components/clients/ClientApp';
import Header from './components/header/Header';
import Signup from './components/signup/SignUp';
import Login from './components/login/LogIn';

function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/api/Clients" element={<Clients />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
