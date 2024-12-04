import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    dateBirth: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formattedDateBirth = new Date(formData.dateBirth).toISOString();
  
    const dataToSend = { ...formData, dateBirth: formattedDateBirth };
  
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
  
      // Сохранение пользователя в контексте
      login(dataToSend);

      // Redirect to the homepage after successful registration
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <div className="container mt-5">
      <h1>Sign Up</h1>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dateBirth" className="form-label">Date of Birth</label>
          <input
            type="date"
            className="form-control"
            id="dateBirth"
            name="dateBirth"
            value={formData.dateBirth}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}

export default Signup;
