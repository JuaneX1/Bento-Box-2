import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/SignUpForm.css';
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

		await instance.post(`/register`, formData).then( response => {
			onClose();
      // tells user the email was sent
      setShowVerificationBar(true);
			navigate(`/`);
      
		}).catch( error => {
			console.log(error);
			setError( error.response.data );
		});
	};

return (
    <div className="signup-form-container">
      <img src={logo} alt="Logo" className="signup-logo" />
      <div className="signup-content">
        <form onSubmit={handleSubmit}>
          <label htmlFor="first" className="signup-label">First Name:</label>
          <input
            type="text"
            name="first"
            placeholder="First Name"
            className="signup-input"
            value={formData.name}
            onChange={handleChange}
          />
          <label htmlFor="last" className="signup-label">Last Name:</label>
          <input
            type="text"
            name="last"
            placeholder="Last Name"
            className="signup-input"
            value={formData.name}
            onChange={handleChange}
          />
          <label htmlFor="login" className="signup-label">Username:</label>
          <input
            type="text"
            name="login"
            placeholder="Username"
            className="signup-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="email" className="signup-label">Email (Required):</label>
          <input
            type="email"
            name="email"
            placeholder="email@emaildomain.com"
            className="signup-input"
            value={formData.email}
            onChange={handleChange}
            required
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
            title="Enter a valid email address: example@email.com"
          />
          <label htmlFor="password" className="signup-label">Password (Required):</label>
          <input
            type="password"
            name="password"
            placeholder="Secure Password"
            className="signup-input"
            value={formData.password}
            onChange={handleChange}
            pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$" 
            required 
            title="Must contain at least 8 characters, one uppercase letter, one numeric character, and one special character"
          />

          {/* Display error message if there's an error durning call */}
          {error && (
            <div className='error-message'>Error: Username/Email already taken! <br></br>Please choose a different one!</div>
          )}
          <button type="submit" className="signup-submit-btn">
            Sign Up
          </button>
        </form>
        <div className="signup-form-footer">
          <button onClick={onClose} className="close-button">
            Close
          </button>
        </div>
        <div className="back-to-login-container">
          <button onClick={onSwitchBack} className="back-to-login-btn">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
