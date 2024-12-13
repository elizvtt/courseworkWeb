import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useUser } from '../UserContext';
import axios from 'axios';
import './orderpage.css';

const OrderPage = () => {
  const { cartItems, clearCart } = useCart();
  const { user, setUser } = useUser();
  const [orderData, setOrderData] = useState({
    surname: '',
    name: '',
    middleName: '',
    email: '',
    address: {
      city: '',
      street: '',
      apartment: '',
      house: '',
      postalCode: '',
    },
    deliveryMethodId: null,
    paymentMethod: null,
  });

  const [userData, setUserData] = useState(null);

  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [paymentMethods] = useState(['Google Pay', 'Apple Pay', 'Готівкою при отриманні']);
  const [products, setProducts] = useState([]);
  const [useBonusPoints, setUseBonusPoints] = useState(false);

  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const BONUS_MIN = 20000;
  const MAX_DISCOUNT = 20;
  
  useEffect(() => {
    if (user && user.id) {
      fetchUserData(user.id);
    }

    fetchDeliveryMethods();
    fetchProducts();
  }, [user]);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5175/api/Clients/${userId}`);
      setUserData(response.data); 
      setOrderData({
        ...orderData,
        surname: response.data.fullName.split(' ')[0],
        name: response.data.fullName.split(' ')[1],
        middleName: response.data.fullName.split(' ')[2],
        email: response.data.email || '',
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const updateUserBonusPoints = async () => {
    try {
      const response = await axios.get(`http://localhost:5175/api/Clients/${user.id}`);
      setUser(response.data); 
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  
  const fetchDeliveryMethods = async () => {
    try {
      const response = await axios.get('http://localhost:5175/api/DeliveryMethods');
      setDeliveryMethods(response.data);
    } catch (error) {
      console.error('Error fetching delivery methods:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5175/api/Products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const calculateDeliveryCost = () => {
    const selectedDeliveryMethod = deliveryMethods.find((method) => method.id === Number(orderData.deliveryMethodId));
    return selectedDeliveryMethod ? selectedDeliveryMethod.cost : 0;
  };  

  const calculateDiscount = () => {
    if (!useBonusPoints || user.bonusPoints < BONUS_MIN) return 0;
    const bonusMultiplier = Math.min(Math.floor(user.bonusPoints / BONUS_MIN), MAX_DISCOUNT / 5);
    return (calculateTotalAmount() * (bonusMultiplier * 5)) / 100;
  };

  const totalAmount = calculateTotalAmount();
  const deliveryCost = calculateDeliveryCost();
  const bonusDiscount = calculateDiscount();
  const finalAmount = totalAmount + deliveryCost - bonusDiscount;


  const handleSubmitOrder = async () => {
    if (!user) {
      alert('Будь ласка зареєструйтесь для оформлення замовлення');
      return;
    }
  
    const addressString = `${orderData.address.city}, ${orderData.address.street}, ${orderData.address.house}, ${orderData.address.apartment}, ${orderData.address.postalCode}`;

    try {
      // Створюємо заказ
      const orderPayload = {
        clientId: user.id,
        address: addressString,
        deliveryMethodId: orderData.deliveryMethodId,
        paymentMethod: orderData.paymentMethod,
        totalAmount: calculateTotalAmount() + calculateDeliveryCost() - calculateDiscount(),
      };
      console.log('Order Payload:', orderPayload);
    
      // ПОСТ для створення заказу
      const orderResponse = await axios.post('http://localhost:5175/api/Orders', orderPayload);
      const orderId = orderResponse.data.id;
      console.log('Order Response:', orderResponse.data);
    
      // Створюємо масив елементів заказу
      const orderItems = cartItems.map(item => ({
        orderId: orderId,
        productId: item.product.id,
        quantity: item.quantity,
        priceAtPurchase: item.product.discountPrice || item.product.price,
      }));
      console.log('Order Items Payload:', JSON.stringify(orderItems));
    
      // Отправляем каждый товар по отдельности
      const orderItemsPromises = orderItems.map(item =>
        axios.post('http://localhost:5175/api/OrderItems', item, { headers: { 'Content-Type': 'application/json' } })
      );
      
      // Чекаємо на завершення додавання усіх елементів 
      const orderItemsResponses = await Promise.all(orderItemsPromises);
      orderItemsResponses.forEach(response => console.log('Order Item Response:', response.data));

      if (useBonusPoints) {
        const remainingBonusPointsChange = -BONUS_MIN * Math.floor(calculateDiscount() / (calculateTotalAmount() * 0.05));
        console.log(`Списано бонусных баллов: ${BONUS_MIN}`);
      
        try {
          await axios.patch(`http://localhost:5175/api/Clients/UpdatePoints/${user.id}`, {
            bonusPointsChange: remainingBonusPointsChange
          });
          console.log('Бонуси успішно списані');
        } catch (error) {
          console.error('Помилка при списанні бонусів:', error);
        }
      }
      
      // Рассчитываем дополнительные бонусные баллы
      const additionalBonusPoints = Math.floor(calculateTotalAmount() * 0.003);
      console.log(`Бонуси за замовлення: ${additionalBonusPoints}`);
      
      try {
        await axios.patch(`http://localhost:5175/api/Clients/UpdatePoints/${user.id}`, {
          bonusPointsChange: additionalBonusPoints
        });
        console.log('Бонуси успішно додані');
        
        await updateUserBonusPoints();

      } catch (error) {
        console.error('Помилка при додаванні бонусів:', error);
      }
      

      // Очистка корзини після оформлення замовлення 
      const cartId = cartItems.length > 0 ? cartItems[0].cartId : null; 
      if (cartId) {
        await clearCart(cartId);
      } else {
        console.error("Cart ID is not available");
      }

      alert('Успішне оформлення заказу!');

      // Перехід на сторінку користувача
      navigate(`/Profile/${user.id}`);

    } catch (error) {
      console.error('Помилка:', error.response ? error.response : error);
      alert('Помилка при оформлені замовлення. Будь ласка спробуйте ще раз.');
    }
  };

  const handleStepClick = (stepNumber) => {
    setStep(stepNumber);
  };
  
  return (
    <div className="order-page">
      <h1>Оформлення замовлення</h1>
      <div className="order-page-container">
        <div className="order-form">
          <div className="progress-bar">
            <div
              className={`step ${step === 1 ? 'active' : ''}`}
              onClick={() => handleStepClick(1)}
              >Особисті дані
            </div>
            <div
              className={`step ${step === 2 ? 'active' : ''}`}
              onClick={() => handleStepClick(2)}
              >Інформація про доставку
            </div>
          </div>

          {/* Особисті дані форма*/}
          {step === 1 && (
            <div className="personal-data-container">
              <div className="input-group">
                <label htmlFor="surname" className="input-label">Прізвище</label>
                <input
                  type="text"
                  id="surname"
                  value={orderData.surname}
                  onChange={(e) => setOrderData({ ...orderData, surname: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label htmlFor="name" className="input-label">Ім'я</label>
                <input
                  type="text"
                  id="name"
                  value={orderData.name}
                  onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label htmlFor="middleName" className="input-label">По батькові</label>
                <input
                  type="text"
                  id="middleName"
                  value={orderData.middleName}
                  onChange={(e) => setOrderData({ ...orderData, middleName: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label htmlFor="email" className="input-label">Email</label>
                <input
                  type="email"
                  id="email"
                  value={orderData.email}
                  onChange={(e) => setOrderData({ ...orderData, email: e.target.value })}
                />
              </div>
            <button className="personal-data-btn" onClick={() => setStep(2)}>Далі</button>
          </div>
          
          )}

          {/* Форма інформації про доставку */}
          {step === 2 && (
            <div className="delivery-info-container">
              <div className="input-group">
                <label htmlFor="city" className="input-label">Місто</label>
                <input
                  type="text"
                  id="city"
                  value={orderData.address.city}
                  onChange={(e) =>
                    setOrderData({ ...orderData, address: {...orderData.address, city: e.target.value},})
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="street" className="input-label">Вулиця</label>
                <input
                  type="text"
                  id="street"
                  value={orderData.address.street}
                  onChange={(e) =>
                    setOrderData({ ...orderData, address: {...orderData.address, street: e.target.value},})
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="apartment" className="input-label">Квартира</label>
                <input
                  type="text"
                  id="apartment"
                  value={orderData.address.apartment}
                  onChange={(e) =>
                    setOrderData({ ...orderData, address: {...orderData.address, apartment: e.target.value},})
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="house" className="input-label">Будинок</label>
                <input
                  type="text"
                  id="house"
                  value={orderData.address.house}
                  onChange={(e) =>
                    setOrderData({ ...orderData, address: {...orderData.address, house: e.target.value},})
                  }
                />
              </div>
              <div className="input-group">
                <label htmlFor="postal-code" className="input-label">Індекс</label>
                <input
                  type="text"
                  id="postal-code"
                  value={orderData.address.postalCode}
                  onChange={(e) =>
                    setOrderData({ ...orderData, address: {...orderData.address, postalCode: e.target.value},})
                  }
                />
              </div>
              {Object.values(orderData.address).every((field) => field.trim() !== '') && (
              <>
                <div className="delivery-container">
                  <h4>Метод доставки</h4>
                  {deliveryMethods.map((method) => (
                    <label key={method.id} className="delivery-radio-label">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value={method.id}
                        checked={orderData.deliveryMethodId === method.id}
                        onChange={(e) => setOrderData({ ...orderData, deliveryMethodId: Number(e.target.value) })}
                      />
                      <span className="delivery-radio-text">{method.name} - ₴{method.cost}</span>
                    </label>
                  ))}

                </div>
              </>
              )}

              {/* Метод оплати */}
              {Object.values(orderData.address).every((field) => field.trim() !== '') &&
                orderData.deliveryMethodId && (
                <>
                  <div className="payment-container">
                    <h4>Метод оплати</h4>
                    {paymentMethods.map((method) => (
                      <label key={method} className="delivery-radio-label">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          onChange={(e) => setOrderData({ ...orderData, paymentMethod: e.target.value })}
                        />
                        <span className="delivery-radio-text">{method}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {Object.values(orderData.address).every((field) => field.trim() !== '') &&
                orderData.deliveryMethodId &&
                orderData.paymentMethod && (
                  <div className="order-bonus-container">
                  <p>Поточний баланс: {user.bonusPoints} бонусів</p>
                  {user.bonusPoints >= BONUS_MIN && (
                    <label key={BONUS_MIN} className="orderpage-checkbox-label">
                      <input
                        type="checkbox"
                        checked={useBonusPoints}
                        onChange={(e) => setUseBonusPoints(e.target.checked)}
                      />
                      Використати {BONUS_MIN} бонусних балів
                    </label>
                  )}

                  <button className="personal-data-btn" onClick={handleSubmitOrder}>Оформити замовлення</button>
                  </div>
              )}

            </div>
          )}
        </div>

        <div className="cart-summary">
          <h3>Ваше замовлення</h3>
          {cartItems.length === 0 ? (
            <p>Ваш кошик пустий</p>
          ) : (
            <div className="order-carts-container">
              {cartItems.map((item) => {
                const product = products.find((p) => p.id === item.product.id);
                const primaryImage = product?.productImages.find((img) => img.isPrimary)?.imageUrl || '/images/default.png';
                return (
                  <div key={item.id} className="orderpage-item d-flex align-items-center">
                    <img
                      src={`http://localhost:5175${primaryImage}`}
                      alt={item.product.name}
                      className="orderpage-image"
                    />
                    <div className="orderpage-item-details">
                      <span className="orderpage-item-name">{item.product.name}</span>
                      <span className="orderpage-item-quantity">x{item.quantity}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="cart-summary-details">
            <div className="cart-summary-total-amount">Сума товарів: {totalAmount} грн</div>
              {orderData.deliveryMethodId && <div className="cart-summary-delivery-cost">Вартість доставки: {deliveryCost} грн</div>}
              {useBonusPoints && <div>Знижка: -{calculateDiscount()} грн</div>}
                <h4>Разом: {finalAmount} грн</h4>
            </div>
          </div>
      </div>
    </div>
  );
};

export default OrderPage;
