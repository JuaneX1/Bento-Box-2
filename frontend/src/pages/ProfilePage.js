import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Image, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { instance } from '../App';
import logo from '../assets/FinalLogo.png';
import '../css/ProfilePage.css';

const ProfilePage = ({ onClose }) => {
	const [userData, setUserData] = useState('');

	const [error, setError] = useState('');
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();
	
	useEffect(() => {
		const getUserInfo = async () => {
			try {
				const token = sessionStorage.getItem('token');
				const response = await instance.get(`/info`, { headers: { Authorization: token }});
				setUserData(response.data);
			} catch (error) {
				console.error('Error fetching user info:', error);
				setError('Failed to fetch user information');
			}
		};
		getUserInfo();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserData(prevState => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(userData);
		// Update user profile here
	};

	const handleDeleteAccount = async () => {
		try {
			await instance.delete(`/deleteUser`, { headers: { Authorization: sessionStorage.getItem('token') }});
			navigate('/');
		} catch (error) {
			setError(error.response.data.error);
		}
	};

	const getUserInfo = async () => {
		const token = sessionStorage.getItem('token');
		const userInfo = await instance.get(`/info`, { headers: { Authorization: sessionStorage.getItem('token') }});
	}

	getUserInfo();
	
	const handleLogOut = () => {
		console.log("Logging out...");
		navigate('/');
	};

  return (
    <>
      <header className="topbar">
        <Image src={logo} alt="Logo" className="topbar-logo" fluid />
        <div className="topbar-buttons">
          <Link to="/dashboard" className="topbar-btn">Dashboard</Link>
          <Button onClick={handleLogOut} className="log-out-btn">Log Out</Button>
        </div>
      </header>
      <div className="spacerProfile"></div>
      <div className="profile-container">
        <Form onSubmit={handleSubmit} className="profile-form text-light">
          <h2 className="mb-4">Profile Page</h2>
          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" name="firstName" value={userData.first} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" name="lastName" value={userData.last} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Account Username</Form.Label>
            <Form.Control type="text" name="username" value={userData.login} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Account Email</Form.Label>
            <Form.Control type="email" name="email" value={userData.email} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Account Password</Form.Label>
            <Form.Control type="password" name="password" value={userData.password} onChange={handleChange} />
          </Form.Group>
          {/* Delete Account Button */}
          <Button onClick={() => setShowModal(true)} className="mt-4 delete-account-btn" variant="danger" size="sm">Delete Account</Button>
          {/* Update Profile Button */}
          <Button type="submit" className="mt-4">Update Profile</Button>
        </Form>
        <h1>My Profile</h1>
        <p></p>
      </div>
      {showModal && <div className="overlay"></div>}
      {/* Modal for confirming account deletion */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title><strong>Confirm Account Deletion:</strong></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete your account?</p>
        </Modal.Body>
        <Modal.Footer>
          <div></div>
          <Button variant="secondary" onClick={() => setShowModal(false)}>No</Button>
          <div></div>
          <Button variant="danger" onClick={handleDeleteAccount} className="delete-account-final-btn"><strong>Yes</strong></Button>
          <div></div>
        </Modal.Footer>
      </Modal>
      <div className="spacerProfile"></div>
    </>
  );
};

export default ProfilePage;
