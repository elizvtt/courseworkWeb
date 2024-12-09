import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import { CartProvider } from './components/CartContext';
import HomePage from './components/homepage/HomePage';
import Clients from './components/clients/ClientApp';
import Header from './components/header/Header';
import Signup from './components/signup/SignUp';
import Login from './components/login/LogIn';
import Footer from './components/footer/Footer';
import ProductsList from './components/productslist/ProductsList';
import Cart from './components/cartpage/CartPage';
import ProductPage from './components/product/ProductPage';
import UserPage from './components/userprofile/UserPage'


function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Clients" element={<Clients />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Products" element={<ProductsList />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/Products/:productId" element={<ProductPage />} />
            <Route path="/Profile/:id" element={<UserPage />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
