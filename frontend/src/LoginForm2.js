// LoginForm2.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/LoginForm.css';
import logo from './assets/FinalLogo.png';

const LoginForm2 = ({ onClose, onSwitchForm }) => {
    var bp = require('./Path.js');

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(bp.buildPath('api/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                onClose();
                navigate('/dashboard');
            } else {
                setErrorMessage('Incorrect username or password');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="login-form-container">
            <img src={logo} alt="Logo" className="login-logo" />
            <div className="login-content">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="User Name"
                        className="login-input"
                        value={formData.username}
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
                    <button type="submit" className="login-submit-btn">Login</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
                <a href="#" className="forgot-password-link" onClick={(e) => {
                    e.preventDefault();
                    onSwitchForm('login');
                }}>Sign in With Email</a>
                <a href="#forgot" className="forgot-password-link" onClick={(e) => {
                    e.preventDefault();
                    onSwitchForm('forgot');
                }}>Forgot Password?</a>
                <div className="login-form-footer">
                    <button onClick={() => onSwitchForm('signup')} className="signup-button">Sign Up</button>
                    <button onClick={onClose} className="close-button">Close</button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm2;
