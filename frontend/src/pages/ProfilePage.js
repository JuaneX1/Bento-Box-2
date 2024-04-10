import React, { useState } from 'react';
import { Container, Form, Button, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/FinalLogo.png';
import '../css/ProfilePage.css';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });

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

  const handleDeleteAccount = () => {
    console.log("Account deletion initiated...");
    // Deletion logic here
    navigate('/');
  };

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

      <Container className="profile-container">
        <div className="text-center mb-4">
          <Image src={logo} alt="Logo" className="profile-logo" fluid />
        </div>
        <Form onSubmit={handleSubmit} className="profile-form text-light">
          <h2 className="mb-4">Profile Page</h2>
          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" name="firstName" value={userData.firstName} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" name="lastName" value={userData.lastName} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Account Username</Form.Label>
            <Form.Control type="text" name="username" value={userData.username} onChange={handleChange} />
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
          <Button onClick={handleDeleteAccount} className="mt-4 delete-account-btn" variant="danger" size="sm">Delete Account</Button>
          {/* Update Profile Button */}
          <Button type="submit" className="mt-4">Update Profile</Button>
        </Form>
      </Container>
    </>
  );
};

export default ProfilePage;
