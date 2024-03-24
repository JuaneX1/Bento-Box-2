import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import './LoginForm.css';
import logo from '../assets/FinalLogo.png';

// comment and uncomment depending on where deploying on heroku
// if this is our production, use Bento box 2
// if this is our test, use Bento box 3
const app_name = 'bento-box-2-df32a7e90651'
//const app_name = 'bento-box-3-c00801a6c9a4'

// builds path if we local or if we are on heroku
function buildPath(route)
{
    if (process.env.NODE_ENV === 'production')
    {
        return 'https://' + app_name + '.herokuapp.com/' + route;
    }
    else
    {
        return 'http://localhost:5000/' + route;
    }
}

const LoginForm = ({ onClose, onSwitchForm }) => {
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
            const response = await fetch(buildPath('api/login'), {
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
                setErrorMessage('Incorrect email or password');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="login-form-container">
            <img src={logo} alt="Logo" className="signup-logo" />    
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
                    <button type="submit" className="login-submit-btn">Let's Go!</button>
                </form>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <a href="#forgot" className="forgot-password-link">Forgot Password?</a>
                <p>Don't have an account yet?</p>
                <div className="login-form-footer">
                    <button onClick={() => onSwitchForm('signup')} className="signup-button">Sign Up</button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
