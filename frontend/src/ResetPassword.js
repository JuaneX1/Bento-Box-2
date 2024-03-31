import React, { useState } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import './ResetPassword.css';
import logo from './assets/FinalLogo.png';
import { instance } from './App';

const ResetPasswordForm = ({ onClose, onSwitchBack }) => {
	const { token } = useParams();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		password: '',
		confirmPassword: ''
	});
	const [error, setError] = useState('');

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (formData.password != formData.confirmPassword ) {
			setError('Passwords do not match');
			return;
		}
		
		try {
			await instance.post(`/resetPassword/${token}`, { password: formData.password });
			navigate('/');
		} catch (e) {
			console.error('Error:', e);
		}
	};

	return (
		<div className="reset-password-form-container">
			<img src={logo} alt="Logo" className="signup-logo" />
			<div className="reset-password-content">
				<form onSubmit={handleSubmit}>
					<input
						type="password"
						name="password"
						placeholder="New password"
						className="reset-password-input"
						value={formData.password}
						onChange={handleChange}
					/>
					<input
						type="password"
						name="confirmPassword"
						placeholder="Confirm new password"
						className="reset-password-input"
						value={formData.confirmPassword}
						onChange={handleChange}
					/>
					<button type="submit" className="reset-password-submit-btn">
						Reset password
					</button>
					{error && <p>{error}</p>}
				</form>
			</div>
		</div>
	);
};

export default ResetPasswordForm;
