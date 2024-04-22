import React from 'react';
import '../css/AboutUsPage.css';
import BigLogo from '../assets/BB_Logo_Horizontal_COLOR_1.png';
import Gino from '../assets/gino.png';
import Ronit from '../assets/ronit.png';
import Juan from '../assets/juan.png';
import DefaultPic from '../assets/conner.png';
import Nate from '../assets/nate.png';
import Sergio from '../assets/sergio.png';
import Sonny from '../assets/sonny.png'
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
        <div className="about-us-container">
            <div className="topbar">
            <Link to="/" >
                    <img src={BigLogo} alt="Big Logo" />
                </Link>
            </div>
            <div className="title-holder">

                <h1>Meet The Team!</h1>
            </div>
            <div className="team-members">
                {teamMembers.map(member => (
                    <a key={member.id} href={member.link} className="team-member">
                        <div className="team-member-info">
                            <img src={member.image} alt={member.name} className="member-image" />
                            <h2 className="member-name">{member.name}</h2>
                            <p className="member-role">{member.role}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

export default AboutUsPage;
