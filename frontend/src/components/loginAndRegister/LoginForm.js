import { useParams, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import '../../css/LoginForm.css';
import logo from '../../assets/FinalLogo.png';
import { instance } from '../../App';

const LoginForm = ({ onClose, onSwitchForm, onShowForgotPassword }) => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
		
        await instance.post(`/login`, formData ).then( result => {
			sessionStorage.setItem('token', result.data.token);
			onClose();
			navigate('/dashboard');
		}).catch( error => {
			setError( error.response.data.error );
		});
    };

    return (
        <div className="login-form-container">
            <img src={logo} alt="Logo" className="login-logo" />
            <div className="login-content">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="login"
                        placeholder="Username or Email"
                        className="login-input"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="login-input"
                        value={formData.password}
                        onChange={handleChange}
                    />
					{error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-submit-btn">Login</button>
                </form>
                {/* <a href="#" className="signin-username-link" onClick={(e) => {
                    e.preventDefault();
                    onSwitchForm('LoginForm2');
                }}>Sign in With Username</a> */}
                <a href="#forgot" className="forgot-password-link" onClick={(e) => {
                    e.preventDefault();
                    onShowForgotPassword();
                }}>Forgot Password?</a>
                <div className="login-form-footer">
                    <button onClick={() => onSwitchForm('signup')} className="signup-button">Sign Up</button>
                    <button onClick={onClose} className="close-button">Close</button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
