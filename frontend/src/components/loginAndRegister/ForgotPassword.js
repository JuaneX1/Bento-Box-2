import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logo from '../../assets/FinalLogo.png';
import { instance } from '../../App';
import '../../css/ForgotPassword.css';

const ForgotPassword = ({ onClose, onSwitchForm }) => {
	const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: ''
    });
    const [error, setError] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
      
        await instance.post(`/forgotPassword`, formData ).then( response => {
			onClose();
			navigate(`/`);
		}).catch( error => {
			console.log(error);
			setError( error.response.data );
		});
	}

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
					<div className="error-message"> {error.message} </div>
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
