import React from 'react';
import BigLogo from '../assets/BB_Logo_Horizontal_COLOR_1.png';
import Gino from '../assets/gino.png';
import Ronit from '../assets/ronit.png';
import Juan from '../assets/juan.png';
import DefaultPic from '../assets/conner.png';
import Nate from '../assets/nate.png';
import Sergio from '../assets/sergio.png';
import Sonny from '../assets/sonny.png';
import { Link } from 'react-router-dom';

const AboutUsPage = () => {
    const teamMembers = [
        { id: 1, name: 'Juan Peñuela', role: 'Project Manager', image: Juan, link: 'https://juanex1.github.io/juaneportfolio.github.io/portfolio/' },
        { id: 2, name: 'Nathaniel Gibson', role: 'Front End', image: Nate, link: 'https://github.com/gibs0nnn' },
        { id: 3, name: 'SavvyDolphin77', role: 'Front End', image: DefaultPic, link: 'https://github.com/SavvyDolphin77' },
        { id: 4, name: 'Ronit Mahalmani', role: 'API Integration', image: Ronit, link: 'https://github.com/Ronit1120' },
        { id: 5, name: 'Sonny Wemhoener-Cuite', role: 'Database', image: Sonny, link: 'https://github.com/mon357luc' },
        { id: 6, name: 'Gino Benitez', role: 'Mobile Development and Design', image: Gino, link: 'https://github.com/ginobenitez' },
        { id: 7, name: 'Sergio Cardona', role: 'Mobile Development', image: Sergio, link: 'https://github.com/devsergiocardona' }
    ];

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-flex justify-content-between p-2">
                <Link to="/" className="navbar-brand">
                    <img src={BigLogo} alt="Big Logo" className="logo img-fluid mr-3" style={{ minHeight: '50px', maxHeight: '50px' }} />
                </Link>
                <div className="navbar-brand ml-auto">
                    <Link className="nav-link" to="/">
                        <strong>Back To Home</strong>
                    </Link>
                </div>
            </nav>
            <div style={{ background: "linear-gradient(to bottom, #2e77AE, #000000)" }}>
                <div className="container text-center">
                    <div className="col">
                        <h1 className="m-0 text-white p-4"><strong>Meet The Team!</strong></h1>
                    </div>
                    <div className="row justify-content-center">
                        {teamMembers.map(member => (
                            <div key={member.id} className="col-md-4 col-lg-3 mb-4">
                                <a href={member.link} className="card team-member w-100 h-100 overflow-hidden border-black">
                                    <img src={member.image} alt={member.name} className="card-img-top member-image" style={{ backgroundColor: '#111920' }} />
                                    <div className="card-body text-white" style={{ backgroundColor: '#111920' }}>
                                        <h2 className="card-title member-name">{member.name}</h2>
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
