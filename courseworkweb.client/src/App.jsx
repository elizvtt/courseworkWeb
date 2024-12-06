import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import HomePage from './components/homepage/HomePage';
import Clients from './components/clients/ClientApp';
import Header from './components/header/Header';
import Signup from './components/signup/SignUp';
import Login from './components/login/LogIn';
import Footer from './components/footer/Footer';
import Products from './components/products/ProductList'

function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Clients" element={<Clients />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Products" element={<Products />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
