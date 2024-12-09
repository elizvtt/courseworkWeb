import React, { useState } from 'react';
import { useCart } from '../CartContext';
import { useUser } from '../UserContext';
import './orderpage.css';

const OrderPage = () => {
  const { cartItems, updateCartItem } = useCart();
  const { user } = useUser();

  const [step, setStep] = useState(1);
  const [deliveryInfo, setDeliveryInfo] = useState({
    city: '',
    street: '',
    apartment: '',
    house: '',
    postalCode: '',
    deliveryMethod: 'standard',
    paymentMethod: 'creditCard',
  });

  const [personalData, setPersonalData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handlePersonalDataChange = (e) => {
    const { name, value } = e.target;
    setPersonalData({ ...personalData, [name]: value });
  };

  const handleDeliveryInfoChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo({ ...deliveryInfo, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.checked });
  };

  const isPersonalDataFilled = personalData.name && personalData.email;
  const isDeliveryDataFilled = deliveryInfo.city && deliveryInfo.street && deliveryInfo.postalCode;

  const calculateTotalPrice = () => {
    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const deliveryCost = deliveryInfo.deliveryMethod === 'express' ? 50 : 20;
    return total + deliveryCost;
  };

  return (
    <div className="order-container">
      <h1>Оформлення Замовлення</h1>

      <div className="steps">
        <div 
          className={`step ${step === 1 ? 'active' : ''}`} 
          onClick={() => step > 1 && setStep(1)}
        >
          Особисті дані
        </div>
        <div 
          className={`step ${step === 2 ? 'active' : ''}`} 
          onClick={() => isPersonalDataFilled && setStep(2)}
        >
          Інформація про доставку
        </div>
      </div>

      <div className="order-content">
        {step === 1 && (
          <div className="left-container">
            <h3>Особисті дані</h3>
            <div>
              <label>Ім'я:</label>
              <input
                type="text"
                name="name"
                value={personalData.name}
                onChange={handlePersonalDataChange}
              />
            </div>
            <div>
              <label>Електронна пошта:</label>
              <input
                type="email"
                name="email"
                value={personalData.email}
                onChange={handlePersonalDataChange}
              />
            </div>
            {/* Заголовок будет всегда виден, когда шаг 1 активен */}
            <button
              disabled={!isPersonalDataFilled}
              onClick={() => isPersonalDataFilled && setStep(2)}
            >
              Далі
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="left-container">
            <h3>Інформація про доставку</h3>
            <div>
              <label>Місто:</label>
              <input
                type="text"
                name="city"
                value={deliveryInfo.city}
                onChange={handleDeliveryInfoChange}
              />
            </div>
            <div>
              <label>Вулиця:</label>
              <input
                type="text"
                name="street"
                value={deliveryInfo.street}
                onChange={handleDeliveryInfoChange}
              />
            </div>
            <div>
              <label>Квартира:</label>
              <input
                type="text"
                name="apartment"
                value={deliveryInfo.apartment}
                onChange={handleDeliveryInfoChange}
              />
            </div>
            <div>
              <label>Будинок:</label>
              <input
                type="text"
                name="house"
                value={deliveryInfo.house}
                onChange={handleDeliveryInfoChange}
              />
            </div>
            <div>
              <label>Індекс:</label>
              <input
                type="text"
                name="postalCode"
                value={deliveryInfo.postalCode}
                onChange={handleDeliveryInfoChange}
              />
            </div>

            <div>
              <h4>Метод доставки:</h4>
              <label>
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="standard"
                  checked={deliveryInfo.deliveryMethod === 'standard'}
                  onChange={handleCheckboxChange}
                />
                Стандартний
              </label>
              <label>
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="express"
                  checked={deliveryInfo.deliveryMethod === 'express'}
                  onChange={handleCheckboxChange}
                />
                Експрес
              </label>
            </div>

            <div>
              <h4>Метод платежу:</h4>
              <select
                name="paymentMethod"
                value={deliveryInfo.paymentMethod}
                onChange={handleDeliveryInfoChange}
              >
                <option value="creditCard">Кредитна картка</option>
                <option value="cashOnDelivery">Оплата при отриманні</option>
              </select>
            </div>

            <button
              disabled={!isDeliveryDataFilled}
              onClick={() => isDeliveryDataFilled && console.log('Proceed to next step')}
            >
              Оформити
            </button>
          </div>
        )}

        {/* Правый контейнер для товаров */}
        <div className="right-container">
          <h3>Ваші товари</h3>
          {cartItems.map((item) => {
            const primaryImage =
              item.product.productImages.find((img) => img.isPrimary)?.imageUrl || '/images/default.png';
            return (
              <div key={item.id} className="cart-item">
                <img 
                  src={`http://localhost:5175${primaryImage}`} 
                  alt={item.product.name} 
                  className="cart-item-image" 
                />
                <div className="cart-item-details">
                  <span className="cart-item-name">{item.product.name}</span>
                  <span className="cart-item-price">{item.product.price * item.quantity} грн</span>
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
          <div className="total-price">
            <span>Загальна сума: {calculateTotalPrice()} грн</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
