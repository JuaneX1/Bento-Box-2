import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logo from './assets/FinalLogo.png';
import { instance } from './App';
import './ForgotPassword.css';

const ForgotPassword = ({ onClose, onSwitchForm }) => {
	const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
		
        try {
			
            const response = await instance.post('/forgotPassword', formData );

            if (response.status === 200) {
                onClose();
                navigate('/');
            } else {
                setErrorMessage(response.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
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
                    <button type="submit" className="forgot-password-submit-btn">Submit</button>
					{errorMessage && <p>{errorMessage}</p>}
                </form>
                <div className="forgot-password-form-footer">
                    <button onClick={onClose} className="close-button">Close</button>
                    <button onClick={onSwitchForm} className="return-login-button">Return to Login</button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
