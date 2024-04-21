import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logo from '../../assets/FinalLogo.png';
import { instance } from '../../App';

const ForgotPassword = ({ onClose, onSwitchForm, setShowResetBar }) => {
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
        
        try {
            await instance.post(`/forgotPassword`, formData);
            onClose();
            setShowResetBar(true);
            navigate('/');
        } catch (error) {
            console.log(error);
            setError(error.response.data.error);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                    <div className="forgot-password-form-container p-4 rounded shadow-lg" style={{ backgroundColor: '#111920' }}>
                        <img src={logo} alt="Logo" className="forgot-password-logo mb-4 img-fluid" style={{ maxWidth: '100%', height: 'auto' }} />
                        <form onSubmit={handleSubmit} className="w-100">
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label text-white">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="email@emaildomain.com"
                                    className="form-control forgot-password-input"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                                    title="Enter a valid email address: example@email.com"
                                />
                            </div>
                            <div className="error-message text-white mb-3">{error}</div>
                            <button type="submit" className="btn btn-primary w-100 mb-3">Submit</button>
                        </form>
                        <div className="forgot-password-form-footer d-flex justify-content-center">
                            <button onClick={onSwitchForm} className="btn btn-secondary return-login-button me-2">Return to Login</button>
                            <button onClick={onClose} className="btn btn-danger close-button">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
