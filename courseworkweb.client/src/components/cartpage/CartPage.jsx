import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import { Link, useNavigate } from 'react-router-dom';
import './cartpage.css';

function CartPage() {
  const { cartItems, updateCartItem, clearCart } = useCart();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const cartId = cartItems.length > 0 ? cartItems[0].cartId : null;

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

  const totalAmount = cartItems.reduce((total, item) => {
    const product = products.find((p) => p.id === item.product.id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <div className="cart-page">
      <h1>Кошик</h1>
      {cartItems.length === 0 ? (
        <div className="empty-cartpage">
          <p>Ваш кошик досі порожній</p>
          <Link to="/Products">Перегляньте товари і додайте ті, що сподобалися</Link>
        </div>
      ) : (
        <div className="full-cartpage">
          {cartItems.map((item) => {
            const product = products.find((p) => p.id === item.product.id);
            const primaryImage = product?.productImages.find((img) => img.isPrimary)?.imageUrl || '/images/default.png';
            
            return (
              <div key={item.id} className="cartpage-item d-flex align-items-center">
                <Link to={`/Products/${item.product.id}`} className="cartpage-link d-flex align-items-center">
                  <img
                    src={`http://localhost:5175${primaryImage}`}
                    alt={item.product.name}
                    className="cartpage-image"
                  />
                  <div className="cartpage-item-details">
                    <span className="cartpage-item-name">{item.product.name}</span>
                    <span className="cartpage-item-price">{item.product.price * item.quantity} грн</span>
                  </div>
                  <div className="cartpage-item-quantity">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateCartItem(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="mx-2-cp">{item.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => updateCartItem(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </Link>
              </div>
            );
          })}
          <div className="cart-actions">
            <div className="total-amount">
              <span style={{fontWeight: 'bold'}}>Разом: </span>
              <span>{totalAmount} грн</span>
            </div>
            <button className="btn-cartpage" onClick={() => navigate('/checkout')}>
              Оформити замовлення
            </button>
            <button className="btn-cartpage" onClick={() => clearCart(cartId)}>
              Очистити кошик
              <img src="/trash-can.svg" alt="Trash Can" className="trashcan-icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
