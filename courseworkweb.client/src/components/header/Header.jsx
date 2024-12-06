import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './header.css';
import { useUser } from '../UserContext';

function Header() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]); // Состояние корзины

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5175/api/Categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // Заглушка для корзины
    const fetchCartItems = () => {
      setCartItems([]); // Здесь подставьте запрос для получения корзины
    };

    fetchCategories();
    fetchCartItems();
  }, []);

  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
    closeOverlay();
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleLogOut = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <nav className="navbar navbar-expand-sm navbar-light bg-white navbar-custom mb-3">
        <div className="container-fluid">
          <button className="menu-button" onClick={toggleOverlay}>
            <img src="/menu.svg" alt="Menu" className="menu-icon" />
          </button>
          <Link className="navbar-brand" to="/">Magaz</Link>
          <div className="navbar-collapse collapse d-flex justify-content-between align-items-center w-100">
            <div className="search-container">
              <div className="search-wrapper">
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Пошук"
                  style={{
                    backgroundColor: 'rgba(163, 154, 146, 0.4)',
                    borderColor: 'rgba(163, 154, 146, 0.4)',
                  }}
                />
                <img src="/loupe.svg" alt="Search" className="search-icon" />
              </div>
            </div>
            <ul className="navbar-nav d-flex align-items-center">
              <img src="/signup.svg" alt="SignUp" className="signup-icon" />
              {user ? (
                <li
                  className="nav-item"
                  onMouseEnter={() => setIsProfileDropdownOpen(true)}
                  onMouseLeave={() => setIsProfileDropdownOpen(false)}
                >
                  <span className="nav-link">Вітаємо, {user?.fullName}</span>
                  {isProfileDropdownOpen && (
                    <div className="dropdown-menu">
                      <Link className="dropdown-item" to="/profile">Профіль</Link>
                      <Link className="dropdown-item" to="/orders">Мої замовлення</Link>
                      <Link className="dropdown-item" to="/bonuses">Мої бонуси</Link>
                      <button className="dropdown-item btn btn-link" onClick={handleLogOut}>
                        Вийти
                      </button>
                    </div>
                  )}
                </li>
              ) : (
                <li className="nav-item signup-item">
                  <button className="nav-link btn btn-link" onClick={handleSignUpClick}>Увійти</button>
                </li>
              )}

              <li
                className="nav-item cart-item"
                onMouseEnter={() => setIsCartDropdownOpen(true)}
                onMouseLeave={() => setIsCartDropdownOpen(false)}
              >
                <Link className="nav-link" to="/Cart">
                  <img src="/cart.svg" alt="Cart" className="cart-icon" />
                </Link>
                {isCartDropdownOpen && (
                  <div className="dropdown-menu">
                    {cartItems.length === 0 ? (
                      <span className="dropdown-item">Ваш кошик порожній</span>
                    ) : (
                      cartItems.map((item, index) => (
                        <div key={index} className="dropdown-item">
                          {item.name} - {item.quantity} шт.
                        </div>
                      ))
                    )}
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className={`overlay ${isOverlayOpen ? 'open' : ''}`}>
        <div className="overlay-content">
          <p className="menuCategories">Категорії</p>
          {categories.map((category) => (
            <div key={category.id}>
              <Link to="#" onClick={() => handleCategoryClick(category.id)}>
                {category.name}
              </Link>
              {category.subcategories &&
                category.subcategories.map((subcategory) => (
                  <div key={subcategory.id} className="subcategory">
                    <Link to="#" onClick={() => handleCategoryClick(subcategory.id)}>
                      {subcategory.name}
                    </Link>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      <div
        className={`blur-background ${isOverlayOpen ? 'active' : ''}`}
        onClick={toggleOverlay}
      ></div>
    </header>
  );
}

export default Header;