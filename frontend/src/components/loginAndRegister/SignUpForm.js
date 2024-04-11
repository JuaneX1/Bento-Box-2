import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/SignUpForm.css';
import logo from '../../assets/FinalLogo.png';
import { instance } from '../../App';

const SignUpForm = ({ onClose, onSwitchBack }) => {

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
          <input
            type="text"
            name="first"
            placeholder="First name"
            className="signup-input"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="last"
            placeholder="Last name"
            className="signup-input"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="login"
            placeholder="Username"
            className="signup-input"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="signup-input"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="signup-input"
            value={formData.password}
            onChange={handleChange}
          />
		  {error && Array.isArray(error.passComplexity) ? (
			<div className="error-message"> Your password must include:
				<ul className="error-message-list">
					{error.passComplexity.map((e, i) => <li className="error-message-list-items" key={i}>{e}</li>)}
				</ul>
			</div>
			) : (
			<div className="error-message"> {error.message} </div>
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
