import React, { useState } from 'react';
import './ForgotPassword.css';
import logo from './assets/FinalLogo.png';

const ForgotPassword = ({ onClose, onSwitchForm }) => {
    const [formData, setFormData] = useState({
        email: '',
        username: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Form data submitted:', formData);
    };

    return (
        <div className="forgot-password-form-container">
            <img src={logo} alt="Logo" className="forgot-password-logo" />
            <div className="forgot-password-content">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        className="forgot-password-input"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="forgot-password-input"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <button type="submit" className="forgot-password-submit-btn">Submit</button>
                </form>
                <div className="forgot-password-form-footer">
                    <button onClick={onSwitchForm} className="return-login-button">Return to Login</button>
                    <button onClick={onClose} className="close-button">Close</button>
                </div>

            </div>
        </div>
    );
};

export default ForgotPassword;
