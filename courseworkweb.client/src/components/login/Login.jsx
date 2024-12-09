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

  // Управление изменением значений полей ввода
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Обработка отправки формы (проверка email и пароля)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Проверяем существует ли пользователь с такой почтой
      const response = await fetch('http://localhost:5175/api/Clients?email=' + formData.email);
      const data = await response.json();

      if (!response.ok || data.length === 0) {
        setError('Почта не найдена. Создайте аккаунт.');
        return;
      }

      // Если почта найдена, проверяем пароль
      const user = data[0]; // Получаем первого пользователя с такой почтой

      if (user.password !== formData.password) {
        setError('Неверный пароль');
        return;
      }


      // Создаем токен для пользователя (например, с использованием email и ID)
      const token = btoa(`${user.email}:${user.id}`); // Простой пример создания токена

      // Сохраняем токен в localStorage
      localStorage.setItem('auth_token', token);

      // Если почта и пароль верны, авторизуем пользователя
      login(user);

      // Закрываем модальное окно
      const modalElement = document.getElementById('loginModal');
      const modal = new window.bootstrap.Modal(modalElement);
      modal.hide();

      // Убираем темный фон (backdrop)
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
      
      // Перенаправляем на главную страницу после успешного входа
      navigate('/');
      window.location.reload();
    } catch (error) {
      setError('Произошла ошибка при входе.');
    }
  };

  // useEffect для управления модальным окном
  useEffect(() => {
    const modalElement = document.getElementById('loginModal');
    const modal = new window.bootstrap.Modal(modalElement);

    modal.show();

    // Слушаем закрытие модального окна
    modalElement.addEventListener('hidden.bs.modal', () => {
      // Убираем темный фон вручную
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }

      // Перенаправляем на главную страницу после закрытия
      navigate('/');
    });

    // Убираем слушатель после размонтирования компонента
    return () => {
      modalElement.removeEventListener('hidden.bs.modal', () => {
        navigate('/');
      });
    };
  }, [navigate]); // Зависимость от navigate для актуализации при переходах

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
