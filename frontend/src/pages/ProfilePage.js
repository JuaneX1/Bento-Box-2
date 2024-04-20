import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Image, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { instance } from '../App';
import logo from '../assets/FinalLogo.png';


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
                  <Link to="/dashboard" className="topbar-btn btn btn-primary">Dashboard</Link>
                  <Button onClick={handleLogOut} className="log-out-btn btn btn-danger">Log Out</Button>
              </div>
            </header>
            {/* the 89.20 is to ensure gradient doesn't repeat in container*/}
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '89.20vh' }}>
            <Container className="text-white">
                <div className="profile-content border-whiteborder border-secondary bg-black p-4 rounded">
                    <h1 className="mb-4">My Profile</h1>
                    {isEditing ? (
                        <Form onSubmit={handleSubmit} className="profile-form text-light align-labels-left">
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
                            <Button type="submit" className="mt-4 profile-btn btn btn-success">Update Profile</Button>
                        </Form>
                    ) : (
                        <div className="profile-info flex justify-items-left">
                            <p className='d-flex align-items-start'><strong>First Name:</strong> <div className='p-1'> </div><span>{userData.first}</span> </p>
                            <p className='d-flex align-items-start'><strong>Last Name:</strong> <div className='p-1'></div>{userData.last}</p>
                            <p className='d-flex align-items-start'><strong>Username:</strong> <div className='p-1'></div>{userData.login}</p>
                            <p className='d-flex align-items-start'><strong>Email:</strong><div className='p-1'></div> {userData.email}</p>
                            {/* Edit Profile Button */}
                            <Button onClick={handleToggleEdit} className="edit-profile-btn btn btn-primary">Edit Profile</Button>
                        </div>
                    )}
                    {/* Delete Account Button */}
                    <Button onClick={() => setShowModal(true)} className="mt-4 delete-account-btn btn btn-danger">Delete Account</Button>
                </div>
            </Container>
            </div>
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
                    <Button variant="danger" onClick={handleDeleteAccount} className="delete-account-final-btn btn btn-danger"><strong>Yes</strong></Button>
                    <div></div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProfilePage;