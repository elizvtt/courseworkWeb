import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import './userpage.css';

const UserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [selectedTab, setSelectedTab] = useState('info');
  const [clientData, setClientData] = useState(null);

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const withCountryCode = cleaned.length === 10 ? `38${cleaned}` : cleaned;
    const match = withCountryCode.match(/^(\d{2})(\d{3})(\d{3})(\d{4})$/);
    return match ? `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}` : phoneNumber;
  };

  useEffect(() => {
    if (id && user?.id) {
      fetch(`http://localhost:5175/api/Clients/${id}`)
        .then((response) => {
          if (!response.ok) {
            console.error('Error while receiving data');
            return;
          }
          return response.json();
        })
        .then((data) => {
          console.log('Received data:', data); 
          
          setClientData(data);
          console.log('Client Data:',clientData?.orders);
        })
        .catch((error) => {
          console.error('Error loading user data:', error);
        });
    }
  }, [id, user?.id]);

  const handleLogOut = () => {
    logout();
    navigate('/');
  };

  const handleTabChange = (newTab) => {
    setSelectedTab(newTab);
  };

  const getNameParts = (fullName) => {
    const nameParts = fullName ? fullName.split(' ') : [];
    const lastName = nameParts[0] || ''; 
    const firstName = nameParts[1] || '';
    const middleName = nameParts[2] || '';
    return { lastName, firstName, middleName };
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'info':
        return (
          <div className="tab-content">
            <h2>Контактна інформація</h2>
            {clientData ? (
              <>
                <p className="label">Прізвище</p>
                <p className="value">{getNameParts(clientData?.fullName)?.lastName || 'Не вказано'}</p>

                <p className="label">Ім'я</p>
                <p className="value">{getNameParts(clientData?.fullName)?.firstName || 'Не вказано'}</p>

                <p className="label">По батькові</p>
                <p className="value">{getNameParts(clientData?.fullName)?.middleName || 'Не вказано'}</p>

                <p className="label">Пошта</p>
                <p className="value">{clientData?.email || 'Не вказано'}</p>

                <p className="label">Дата народження</p>
                <p className="value">
                  {clientData?.dateBirth
                    ? new Date(clientData?.dateBirth).toLocaleDateString('uk-UK', { year: 'numeric', month: 'long', day: 'numeric' })
                    : 'Не вказано'}
                </p>

                <p className="label">Номер телефону</p>
                <p className="value">
                  {clientData?.phoneNumber ? formatPhoneNumber(clientData?.phoneNumber) : 'Не вказано'}
                </p>
              </>
            ) : (
              <p>Завантаження даних</p>
            )}
          </div>
        );
      case 'orders':
        return (
          <div className="tab-content">
            <h2>Мої замовлення</h2>
            {clientData?.orders?.length > 0 ? (
              clientData.orders.map((order) => {
                let statusClass = '';
                switch (order.status) {
                  case 'В обробці':
                    statusClass = 'status-processing';
                    break;
                  case 'Відправлено':
                    statusClass = 'status-shipped';
                    break;
                  case 'Доставлено':
                    statusClass = 'status-delivered';
                    break;
                  default:
                    statusClass = '';
                }

                return (
                  <div key={order.id} className="order-item">
                    <div className={`order-item-status ${statusClass}`}>
                      <p className="order-item-info">Замовлення №{order.id}, {new Date(order.orderDate).toLocaleDateString('uk-UK', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12:false})}</p>
                      <p> {order.status}</p>
                    </div>
                    <div className="order-item-cost-item">
                      <p className="order-item-cost"> {order.totalAmount} грн</p>
                    </div>
                    
                      
                      <div className="user-page-order-items">
                        {order.orderItems.map((item) => {
                          const product = item.product;
                          const primaryImage = product?.productImages.find((img) => img.isPrimary)?.imageUrl || '/images/default.png';
                          
                          return (
                            <div key={item.id} className="user-page-order-item-details">
                              <img 
                                src={`http://localhost:5175${primaryImage}`} 
                                alt={product.name} 
                                className="user-page-order-item-image" 
                              />
                            </div>
                          );
                        })}
                      </div> 
                  </div>
                )
              })
            ) : (
              <div>
                <p>У вас поки що немає замовлень</p>
                <Link to="/Products" className="products-link">Перегляньте товари і можливо знайдете щось саме для себе!</Link>
              </div>
            )}
          </div>
        );
      case 'bonuses':
        return (
          <div className="tab-content">
            <h2>Мої бонуси</h2>
            <p>Поточний баланс: {clientData?.bonusPoints || 0} бонусів</p>
            <p> Робіть замовлення та залишайте відгуки на товари щоб накопичити бонуси.<br />
              За накопичені бонуси отримуйте кешбек до -20% на всі товари!</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="user-page">
      <div className="user-page-sidebar">
        <button onClick={() => handleTabChange('info')} className={selectedTab === 'info' ? 'active' : ''}>Контактна інформація</button>
        <button onClick={() => handleTabChange('orders')} className={selectedTab === 'orders' ? 'active' : ''}>Мої замовлення</button>
        <button onClick={() => handleTabChange('bonuses')} className={selectedTab === 'bonuses' ? 'active' : ''}>Мої бонуси</button>
        <button onClick={handleLogOut}>Вийти</button>
      </div>
      <div className="user-page-content">{renderTabContent()}</div>
    </div>
  );
};

export default UserPage;
