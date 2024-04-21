import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logo from '../../assets/FinalLogo.png';
import { instance } from '../../App';

const ResetPasswordForm = ({ onClose, onSwitchBack }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await instance.post(`resetPassword/${token}`, { password: formData.password });
      navigate('/');
    } catch (e) {
      console.error('Error:', e);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minWidth: "100vw", minHeight: "100vh", background: "linear-gradient(to bottom, #2e77AE, #000000)" }}>
      <div className="reset-password-form-container p-4 rounded shadow-lg" style={{ backgroundColor: '#111920', maxWidth: '500px' }}>
        <img src={logo} alt="Logo" className="reset-password-logo mb-2 img-fluid h-50 p-4" />
        <div className="reset-password-content">
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              name="password"
              placeholder="New password"
              className="reset-password-input form-control mb-3"
              value={formData.password}
              onChange={handleChange}
			  pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$"
			  required
			  title="Must contain at least 8 characters, one uppercase letter, one numeric character, and one special character"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              className="reset-password-input form-control mb-3"
              value={formData.confirmPassword}
              onChange={handleChange}
			  pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$"
			  required
			  title="Must contain at least 8 characters, one uppercase letter, one numeric character, and one special character"
            />
            <button type="submit" className="reset-password-submit-btn btn btn-primary w-100">Reset password</button>
            {error && <p className="text-white mt-3">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
