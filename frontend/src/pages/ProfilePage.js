import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Image, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { instance } from '../App';
import logo from '../assets/FinalLogo.png';
import '../css/ProfilePage.css';

const ProfilePage = ({ onClose }) => {
    const [userData, setUserData] = useState('');
    const [originalUserData, setOriginalUserData] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await instance.get(`/info`, { headers: { Authorization: token }});
                setUserData(response.data);
                setOriginalUserData(response.data); // Save original user data for comparison
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

    const handleToggleEdit = () => {
        setIsEditing(prevState => !prevState);
        if (!isEditing) {
            // Reset user data to original values when toggling edit mode off
            setUserData(originalUserData);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        await instance.patch(`/updateInfo`, userData, { headers: { Authorization: sessionStorage.getItem('token') }} ).then( response => {
            sessionStorage.setItem('token', response.data.token);
            setIsEditing(false); // Disable edit mode after successful update
        }).catch( error => {
            console.log(error);
            setError( error );
        });
    };

    const handleDeleteAccount = async () => {
        try {
            await instance.delete(`/deleteUser`, { headers: { Authorization: sessionStorage.getItem('token') }});
            navigate('/');
        } catch (error) {
            setError(error.response.data.error);
        }
    };
    
    const handleLogOut = () => {
        console.log("Logging out...");
        navigate('/');
    };

    return (
        <>
            <header className="topbar">
              <Link to="/dashboard">
                <Image src={logo} alt="Logo" className="topbar-logo" fluid />
              </Link>
              <div className="topbar-buttons">
                  <Link to="/dashboard" className="topbar-btn">Dashboard</Link>
                  <Button onClick={handleLogOut} className="log-out-btn">Log Out</Button>
              </div>
            </header>
            <div className="spacerProfile"></div>
            <Container className="profile-container">
                <div className="profile-content">
                    <h2 className="mb-4">My Profile</h2>
                    {isEditing ? (
                        <Form onSubmit={handleSubmit} className="profile-form text-light">
                            <Form.Group className="mb-3" controlId="formFirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" name="first" value={userData.first} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formLastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" name="last" value={userData.last} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" name="login" value={userData.login} onChange={handleChange} />
                            </Form.Group>
                            {/* Update Profile Button */}
                            <Button type="submit" className="mt-4 profile-btn">Update Profile</Button>
                        </Form>
                    ) : (
                        <div className="profile-info">
                            <p><strong>First Name:</strong> {userData.first}</p>
                            <p><strong>Last Name:</strong> {userData.last}</p>
                            <p><strong>Username:</strong> {userData.login}</p>
                            <p><strong>Email:</strong> {userData.email}</p>
                            {/* Edit Profile Button */}
                            <Button onClick={handleToggleEdit} className="edit-profile-btn">Edit Profile</Button>
                        </div>
                    )}
                    {/* Delete Account Button */}
                    <Button onClick={() => setShowModal(true)} className="mt-4 delete-account-btn" variant="danger">Delete Account</Button>
                </div>
            </Container>
            {showModal && <div className="overlay"></div>}
            {/* Modal for confirming account deletion */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
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
