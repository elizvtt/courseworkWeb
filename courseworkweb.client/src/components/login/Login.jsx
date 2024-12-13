import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import './login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  // Управління зміною значень полів уведення
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Обробка форми
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Чи існіє користувач з такою поштою
      const response = await fetch('http://localhost:5175/api/Clients/CheckEmail?email=' + formData.email);
      const data = await response.json();
  
      console.log('Відповідь:', data);
  
      if (!response.ok) {
        console.error('Помилка при запросі:', response.status);
        setError('Виникла помилка при перевірці електронної пошти.');
        return;
      }
  
      if (!data.exists) {
        setError('Почта не знайдена. Спочатку зареєструйтесь!');
        return;
      }
  
      // Перевіряємо чи існує пароль
      const responsePassword = await fetch('http://localhost:5175/api/Clients/GetUserByEmail?email=' + formData.email);
      const userData = await responsePassword.json();
  
      console.log('Дані користувача:', userData);
  
      if (!userData || !userData.password) {
        setError('Невідомий користувач або відсутній пароль.');
        return;
      }
  
      // Перевірка на збіг пароля
      if (userData.password !== formData.password) {
        setError('Невірний пароль');
        return;
      }
  
      // Створюємо токен
      const token = btoa(`${userData.email}:${userData.id}`);
  
      // Зберігаємо токен
      localStorage.setItem('auth_token', token);
  
      // Авторизуємо користувча 
      login(userData);
  
      // Закриття модального вікна
      const modalElement = document.getElementById('loginModal');
      const modal = new window.bootstrap.Modal(modalElement);
      modal.hide();
  
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
      
      // Перехід на головну
      navigate('/');
      window.location.reload();
    } catch (error) {
      setError('Виникла помилка при вході.');
    }
  };
  

  // useEffect для управління модальним вікном
  useEffect(() => {
    const modalElement = document.getElementById('loginModal');
    const modal = new window.bootstrap.Modal(modalElement);

    modal.show();

    modalElement.addEventListener('hidden.bs.modal', () => {
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }

      navigate('/');
    });

    return () => {
      modalElement.removeEventListener('hidden.bs.modal', () => {
        navigate('/');
      });
    };
  }, [navigate]);
  
  return (
    <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="loginModalLabel">Вхід</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Електронна пошта"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ backgroundColor: '#F9F7F5', borderColor: '#F9F7F5' }}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Пароль"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ backgroundColor: '#F9F7F5', borderColor: '#F9F7F5' }}
                />
              </div>
              <button type="submit" className="btn btn-primary button">Вхід</button>
              <div className="modal-signup">
                <h5>Досі не маєте акаунту?</h5>
                <p>
                  <a href="/signup">Зареєструватися</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
