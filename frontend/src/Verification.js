import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpForm.css';
import logo from './assets/FinalLogo.png';
const bp = require('./Path.js');

const Verification = ({ onClose }) => {
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(bp.buildPath('api/login'), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                onClose(); // Fix the typo here
                navigate('./Dashboard');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}> {/* Pass the handleSubmit function reference */}
                <button type="submit">Verify</button>
            </form>
        </div>
    );
};

export default Verification;
