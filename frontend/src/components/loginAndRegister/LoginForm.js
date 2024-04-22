import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../App';
import logo from '../../assets/FinalLogo.png';

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

        try {
            const result = await instance.post(`/login`, formData);
            sessionStorage.setItem('token', result.data.token);
            onClose();
            navigate('/dashboard');
        } catch (error) {
            setError(error.response.data.error);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                    <div className="d-flex flex-column align-items-center justify-content-center p-4 rounded shadow-lg" style={{ backgroundColor: '#111920' }}>
                        <img src={logo} alt="Logo" className="mb-4 img-fluid" style={{ maxWidth: '100%', height: 'auto' }} />
                        <form onSubmit={handleSubmit} className="w-100">
                            <div className="mb-3">
                                <label htmlFor="login" className="form-label text-white">Username/Email:</label>
                                <input
                                    type="text"
                                    name="login"
                                    placeholder="Username or Email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label text-white">Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className="form-control"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            {error && <p className="text-white text-center">{error}</p>}
                            <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
                        </form>
                        <a href="#forgot" className="forgot-password-link btn btn-secondary" onClick={(e) => {
                            e.preventDefault();
                            onShowForgotPassword();
                        }}>Forgot Password?</a>
                        <div className="d-flex justify-content-center mt-3">
                            <button onClick={() => onSwitchForm('signup')} className="btn btn-primary me-2">Sign Up</button>
                            <button onClick={onClose} className="btn btn-danger">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
