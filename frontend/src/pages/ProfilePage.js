import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { instance } from '../App';
import logo from '../assets/FinalLogo.png';
import styled from 'styled-components';

const ProfilePage = ({ onClose }) => {
    const [userData, setUserData] = useState('');
    const [originalUserData, setOriginalUserData] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const [showUpdateProfile, setShowUpdatedProfile] = useState(false);
    
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
        setShowUpdatedProfile(false);
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
            setShowUpdatedProfile(true);
        }).catch( error => {
            console.log(error);
            setError( error );
        });
    };

    const handleDeleteAccount = async () => {
        try {
            await instance.delete(`/deleteUser`, { headers: { Authorization: sessionStorage.getItem('token') }});
            navigate('/?action=delete');
        } catch (error) {
            setError(error.response.data.error);
        }
    };
    
    const handleLogOut = () => {
        console.log("Logging out...");
        navigate('/');
    };

    const TopNavbar = styled.nav`
        background-color: #111920; 
    `;

    const CustomLink = styled.div`
        border: none;
        transition: all 0.3s ease;

        &:hover,
        &:focus {
        border: 2px solid white;
        transform: scale(1.05);
        }
  `;

    return (
        <>
            <TopNavbar className="navbar navbar-expand-lg navbar-dark d-flex justify-content-between p-2">
                <div className="container-fluid">                
                <CustomLink className='p-2 ml-2 navbar-brand'>   
                <Link to="/dashboard" className="text-white text-decoration-none">
                        <strong>Back to Anime</strong>
                    </Link>
                    </CustomLink>
                    <Link to="/dashboard" className="navbar-brand ml-auto">
                        <img src={logo} alt="Big Logo" className="logo img-fluid mr-3" style={{ minHeight: '50px', maxHeight: '50px' }} />
                    </Link>
                    <div className="ml-auto">
                        <Button onClick={handleLogOut} className="btn btn-danger">
                            <strong>Log Out</strong>
                        </Button>
                    </div>
                </div>
            </TopNavbar>
            <div style={{ minHeight: '89.75vh', background: "linear-gradient(to bottom, #2e77AE, #000000)" }}>
            {showUpdateProfile && (
                    <div className="verification-bar bg-success text-white p-2">
                        <p className="m-0 text-center">
                            Profile Successfully Updated!
                        </p>
                    </div>
                )}
                <div className='p-5 d-flex justify-content-center align-items-center'>
                <Container className="text-white" style={{ maxWidth: '500px' }}>
                    <div className="profile-content border-white border-secondary p-4 rounded" style={{backgroundColor: "#111920"}}>
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
                                {/* Cancel Button */}
                                <div className='d-flex justify-content-start'>
                                    <Button onClick={handleToggleEdit} className="mt-4 p-2 btn btn-secondary mr-2">Stop Editing</Button>
                                    <Container style={{ maxWidth: "1px", margin: "0px"}}></Container>
                                    {/* Update Profile Button */}
                                    <Button type="submit" className="mt-4 p-2 profile-btn btn btn-success">Update Profile</Button>
                                </div>
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
            </div>
            {showModal && <div className="overlay"></div>}
            {/* Modal for confirming account deletion */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered >
                <Modal.Header className="text-white" style={{backgroundColor: "#111920"}}>
                    <Modal.Title><strong>Confirm Account Deletion:</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-white" style={{backgroundColor: "#111920"}}>
                    <div className='p-1'></div>
                    <p>Are you sure you want to delete your account?</p>
                </Modal.Body>
                <Modal.Footer className="text-white d-flex justify-content-start" style={{backgroundColor: "#111920"}}>
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
