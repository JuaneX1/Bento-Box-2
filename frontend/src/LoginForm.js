import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './LoginForm.css';
import logo from './assets/FinalLogo.png';

const LoginForm = ({ onClose, onSwitchForm }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/login', {
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
                // Handle incorrect login credentials
                console.error('Incorrect email or password');
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
                        name="email"
                        placeholder="Email"
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
                    <button type="submit" className="login-submit-btn">Login</button>
                </form>
                <a href="#forgot" className="forgot-password-link">Forgot Password?</a>
                <div className="login-form-footer">
                    <button onClick={onClose} className="close-button">Close</button>
                    <button onClick={() => onSwitchForm('signup')} className="signup-button">Sign Up</button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
