import React from 'react';
import BigLogo from '../assets/BB_Logo_Horizontal_COLOR_1.png';
import Gino from '../assets/gino.png';
import Ronit from '../assets/ronit.png';
import Juan from '../assets/juan.png';
import Conner from '../assets/conner.png';
import Nate from '../assets/nate.png';
import Sergio from '../assets/sergio.png';
import Sonny from '../assets/sonny.png';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const AboutUsPage = () => {
    const teamMembers = [
        { id: 1, name: 'Juan Peñuela', role: 'Project Manager', image: Juan, link: 'https://juanex1.github.io/juaneportfolio.github.io/portfolio/' },
        { id: 2, name: 'Nathaniel Gibson', role: 'Front End', image: Nate, link: 'https://github.com/gibs0nnn' },
        { id: 3, name: 'Conner Harbaugh', role: 'Front End', image: Conner, link: 'https://github.com/SavvyDolphin77' },
        { id: 4, name: 'Ronit Mahalmani', role: 'API Integration', image: Ronit, link: 'https://github.com/Ronit1120' },
        { id: 5, name: 'Sonny Wemhoener-Cuite', role: 'Database', image: Sonny, link: 'https://github.com/mon357luc' },
        { id: 6, name: 'Gino Benitez', role: 'Mobile Development & Design', image: Gino, link: 'https://github.com/ginobenitez' },
        { id: 7, name: 'Sergio Cardona', role: 'Mobile Development', image: Sergio, link: 'https://github.com/devsergiocardona' }
    ];

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
                <Link to="/" className="navbar-brand">
                    <img src={BigLogo} alt="Big Logo" className="logo img-fluid mr-3" style={{ minHeight: '50px', maxHeight: '50px' }} />
                </Link>
                <div className="navbar-brand ml-auto">
                <CustomLink className="nav-link p-2" >
                    <Link className="text-white text-decoration-none" to="/"><strong>Back To Home</strong></Link>
                </CustomLink>
                </div>
            </TopNavbar>
            <div style={{ background: "linear-gradient(to bottom, #2e77AE, #000000)", minHeight: "89.75vh" }}>
                <div className="container text-center">
                    <div className="col">
                        <h1 className="m-0 text-white p-4"><strong>Meet The Team!</strong></h1>
                    </div>
                    <div className="row justify-content-center">
                        {teamMembers.map(member => (
                            <div key={member.id} className="col-md-4 col-lg-3 mb-4">
                                <a href={member.link} className="card team-member overflow-hidden border-black align-items-center" style={{ backgroundColor: '#111920' }}>
                                    <img src={member.image} alt={member.name} className="card-img-top member-image mx-auto d-block w-50 h-50 p-2" />
                                    <div className="card-body text-white">
                                        <h2 className="card-title member-name fs-5">{member.name}</h2>
                                        <p className="card-text member-role">{member.role}</p>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AboutUsPage;
