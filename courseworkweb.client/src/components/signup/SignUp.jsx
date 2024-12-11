import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import "./signup.css"

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    dateBirth: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  useEffect(() => {
    const modalElement = document.getElementById('signupModal');
    const modal = new window.bootstrap.Modal(modalElement);

    modal.show();

    modalElement.addEventListener('hidden.bs.modal', () => {
      navigate('/');
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    });

    return () => {
      modalElement.removeEventListener('hidden.bs.modal', () => {
        navigate('/');
      });
    };
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName) {
      errors.firstName = 'Поле "Прізвище" не може бути порожнім.';
    }
    if (!formData.lastName) {
      errors.lastName = 'Поле "Ім`я" не може бути порожнім.';
    }
    if (!formData.middleName) {
      errors.middleName = 'Поле "По батькові" не може бути порожнім.';
    }
    if (!formData.dateBirth) {
      errors.dateBirth = 'Поле "Дата народження" не може бути порожнім.';
    }
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = 'Введіть коректну електронну пошту.';
    }
    if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Введіть коректний номер телефону.';
    }
    if (!formData.password) {
      errors.password = 'Пароль не може бути порожнім.';
    } else if (formData.password.length < 6) {
      errors.password = 'Пароль повинен бути не менше 6 символів.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; 
    }

    const formattedDateBirth = new Date(formData.dateBirth).toISOString();
    const fullName = `${formData.firstName} ${formData.lastName} ${formData.middleName}`;

    const dataToSend = { ...formData, fullName, dateBirth: formattedDateBirth };

    try {
      const response = await fetch('http://localhost:5175/api/Clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Failed to register user');
      }

      login(dataToSend);

      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="modal fade" id="signupModal" tabIndex="-1" aria-labelledby="signupModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="signupModalLabel">Реєстрація</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  placeholder="Прізвище"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  style={{ backgroundColor: '#F9F7F5', borderColor: '#F9F7F5' }}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  placeholder="Ім'я"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  style={{ backgroundColor: '#F9F7F5', borderColor: '#F9F7F5' }}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="middleName"
                  name="middleName"
                  placeholder="По батькові"
                  value={formData.middleName}
                  onChange={handleChange}
                  required
                  style={{ backgroundColor: '#F9F7F5', borderColor: '#F9F7F5' }}
                />
              </div>
              <div className="mb-3">
                <input
                  type="date"
                  className="form-control"
                  id="dateBirth"
                  name="dateBirth"
                  value={formData.dateBirth}
                  onChange={handleChange}
                  required
                  max="2010-12-31"
                  style={{ backgroundColor: '#F9F7F5', borderColor: '#F9F7F5' }}
                />
              </div>
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
                  type="text"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="+(38)-(***)-(***)-(****)"
                  value={formData.phoneNumber}
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
              <button type="submit" className="signup-btn">Реєстрація</button>
              <div className="modal-login">
                <h5>Вже маєте аккаунт?</h5>
                <p>
                  <a href="/login">Увійти</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;