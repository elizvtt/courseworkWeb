import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { useCart } from '../CartContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './header.css';


function Header() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const { user, logout } = useUser();
  const { cartItems, fetchCartItems, updateCartItem, clearCart } = useCart();
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [fullName, setFullName] = useState(''); 
  const navigate = useNavigate();

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

    fetchCategories();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCartItems(user.id);

      const fetchUserDetails = async () => {
        try {
          const response = await fetch(`http://localhost:5175/api/Clients/${user.id}`);
          const data = await response.json();
          setFullName(data.fullName); // Сохраняем fullName
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };

      fetchUserDetails();
    }
  }, [user]);

  useEffect(() => {
    console.log("User", user); // Добавьте это для отладки
  }, [user]);
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5175/api/Products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
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
    setFullName('');
    navigate('/');
  };

  const cartId = cartItems.length > 0 ? cartItems[0].cartId : null;

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
                  <span className="nav-link">Вітаємо, {fullName || user.fullName}</span>
                  {/* console.log(user.fullName); */}
                  {isProfileDropdownOpen && (
                    <div className="dropdown-menu">
                      <Link className="dropdown-item" to={`/Profile/${user.id}`}>Профіль</Link>
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
                  {cartItems.length > 0 && (
                    <span className="cart-item-count">{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
                  )}
                </Link>
                {isCartDropdownOpen && (
                  <div className="dropdown-menu">
                    {cartItems.length === 0 ? (
                      <span className="dropdown-item">Ваш кошик порожній</span>
                    ) : (
                      <>
                        <h3 className="dropdown-menu-title">Кошик</h3>
                        {cartItems.map((item) => {
                          const product = products.find((p) => p.id === item.product.id);
                          const primaryImage = product?.productImages.find((img) => img.isPrimary)?.imageUrl || '/images/default.png';
                          return (
                            <div key={item.id} className="dropdown-item d-flex align-items-center">
                              <img 
                                src={`http://localhost:5175${primaryImage}`}
                                alt={item.product.name} 
                                className="cart-item-image" 
                              />
                              <div className="cart-item-details">
                                <span className="cart-item-name">{item.product.name}</span>
                                <div className="cart-item-price">
                                  {item.product.discountPrice ? (
                                    <>
                                      <span className="text-muted text-decoration-line-through">
                                        {item.product.price} грн
                                      </span>
                                      <span className="ms-2">
                                        {item.product.discountPrice * item.quantity} грн
                                      </span>
                                    </>
                                  ) : (
                                    <span>{item.product.price * item.quantity} грн</span>
                                  )}
                                </div>
                              </div>
                              <div className="cart-item-quantity">
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => updateCartItem(item.id, item.quantity - 1)}
                                >
                                  -
                                </button>
                                <span className="mx-2">{item.quantity}</span>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => updateCartItem(item.id, item.quantity + 1)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        <div className="dropdown-footer">
                          <button className="btn" onClick={() => navigate('/checkout')}>
                            Оформити замовлення
                          </button>
                          <button className="btn" onClick={() => clearCart(cartId)}>
                            Очистити
                          </button>
                        </div>
                      </>
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
          {categories.filter(category => category.parentId === null).map((category) => (
            <div
              key={category.id}
              onMouseEnter={() => setHoveredCategoryId(category.id)}
              onMouseLeave={() => setHoveredCategoryId(null)}
            >
              <Link to={`/Products?categoryId=${category.id}`} onClick={() => handleCategoryClick(category.id)}>
                {category.name}
              </Link>

              {hoveredCategoryId === category.id &&
                categories.filter(subcategory => subcategory.parentId === category.id).map((subcategory) => (
                  <div key={subcategory.id} className="subcategory">
                    <Link to={`/Products?categoryId=${subcategory.id}`}  onClick={() => handleCategoryClick(subcategory.id)}>
                      {subcategory.name}
                    </Link>
                  </div>
                ))
              }
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
