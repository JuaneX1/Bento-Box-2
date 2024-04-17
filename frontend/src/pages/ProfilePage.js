import React, { useState } from 'react';
import { Button, Image, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { instance } from '../App';
import logo from '../assets/FinalLogo.png';
import '../css/ProfilePage.css';

const ProfilePage = ({ onClose }) => {
  const [userData, setUserData] = useState('');
  
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

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
    console.log(token);
    // TODO : Make API call to get the user info
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
