import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/FinalLogo.png';
import { instance } from '../../App';

const SignUpForm = ({ onClose, onSwitchBack, setShowVerificationBar }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first: '',
    last: '',
    login: '',
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await instance.post(`/register`, formData);
      onClose();
      setShowVerificationBar(true);
      navigate(`/`);
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="signup-form-container p-4 rounded shadow-lg" style={{ backgroundColor: '#111920' }}>
            <div className='d-flex justify-content-center'>
            <img src={logo} alt="Logo" className="signup-logo mb-2 img-fluid" style={{ maxWidth: '75%', height: 'auto' }} />
            </div>
            <div className="signup-content">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="first" className="signup-label text-white">First Name:</label>
                  <input
                    type="text"
                    name="first"
                    placeholder="First Name"
                    className="signup-input form-control"
                    value={formData.first}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="last" className="signup-label text-white">Last Name:</label>
                  <input
                    type="text"
                    name="last"
                    placeholder="Last Name"
                    className="signup-input form-control"
                    value={formData.last}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="login" className="signup-label text-white">Username:</label>
                  <input
                    type="text"
                    name="login"
                    placeholder="Username"
                    className="signup-input form-control"
                    value={formData.login}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="signup-label text-white">Email (Required):</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="email@emaildomain.com"
                    className="signup-input form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                    title="Enter a valid email address: example@email.com"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="signup-label text-white">Password (Required):</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Secure Password"
                    className="signup-input form-control"
                    value={formData.password}
                    onChange={handleChange}
                    pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$"
                    required
                    title="Must contain at least 8 characters, one uppercase letter, one numeric character, and one special character"
                  />
                </div>
                {error && (
                  <div className='error-message text-white mb-3'>Error: Username/Email already taken!</div>
                )}
                <div className='d-flex justify-content-center'>
                <button type="submit" className="signup-submit-btn btn btn-primary align-center">Sign Up</button>
                </div>
              </form>
              <div className="signup-form-footer d-flex justify-content-center mt-3">
                <button onClick={onSwitchBack} className="back-to-login-btn btn btn-secondary me-2">Back to Login</button>
                <button onClick={onClose} className="signup-close-btn btn btn-danger">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
