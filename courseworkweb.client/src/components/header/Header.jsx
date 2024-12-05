import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './header.css';
import { useUser } from '../UserContext';

function Header() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
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
              <div className='search-wrapper'>
              <input type="text" className="form-control search-input" placeholder="Search" style={{backgroundColor: 'rgba(163, 154, 146, 0.4)', borderColor: 'rgba(163, 154, 146, 0.4)'}}/>
                <img src="/loupe.svg" alt="Search" className="search-icon" />
              </div>
            </div>
            <ul className="navbar-nav d-flex align-items-center">
              {user ? (
                // Если пользователь авторизован, показываем его имя и кнопку выхода
                <li className="nav-item">
                  {/* <Link className="nav-link text-" to="/Account">
                    <img src="/signup.svg" alt="SignUp" className="signup-icon" />
                  </Link> */}
                  <span className="nav-link">Вітаємо, {user.fullName}</span>
                  
                  {/* <Link className="nav-link" to="/Account">Вітаємо, {user.fullName}</Link> */}
                  <button className="nav-link btn btn-link" onClick={handleLogOut}>Log out</button>
                </li>
              ) : (
                // Если пользователь не авторизован, показываем кнопку регистрации
                <li className="nav-item signup-item">
                  <img src="/signup.svg" alt="SignUp" className="signup-icon" />
                  <button className="nav-link btn btn-link" onClick={handleSignUpClick}>Sign up</button>
                </li>
              )}
              <li className="nav-item cart-item">
                <Link className="nav-link text-" to="/Cart">
                  <img src="/cart.svg" alt="Cart" className="cart-icon" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className={`overlay ${isOverlayOpen ? 'open' : ''}`}>
         <div className="overlay-content">
           <p className="menuCategories">Категорії</p>
           <Link to="#" onClick={closeOverlay}>Ноутбуки</Link>
           <Link to="#" onClick={closeOverlay}>Планшети</Link>
           <Link to="#" onClick={closeOverlay}>Смартфони</Link>
           <Link to="#" onClick={closeOverlay}>Годинники</Link>
         </div>
       </div>

      <div className={`blur-background ${isOverlayOpen ? 'active' : ''}`} onClick={toggleOverlay}></div>
    </header>
  );
}

export default Header;
