import { useParams, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import '../../css/LoginForm.css';
import logo from '../../assets/FinalLogo.png';
import { instance } from '../../App';

const LoginForm = ({ onClose, onSwitchForm, onShowForgotPassword }) => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
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
            const response = await instance.get('login', { formData} );

            if (response.status === 200) {
				sessionStorage.setItem('token', response.data.token);
                onClose();
                navigate('/dashboard');
            } else {
                setErrorMessage('Incorrect email or password');
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
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
                <a href="#" className="signin-username-link" onClick={(e) => {
                    e.preventDefault();
                    onSwitchForm('LoginForm2');
                }}>Sign in With Username</a>
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
