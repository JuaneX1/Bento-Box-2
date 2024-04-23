import React, { useEffect, useState } from 'react';
import { instance } from '../../App';
import BrowseContent from '../pageFeatures/BrowseContent'
import styled from 'styled-components';

function AnimeSearch({ typeDefault }) {
    const [animeList, setAnimeList] = useState([]);
    const [search, setSearch] = useState("");
    const [animeFound, setAnimeFound] = useState([]);
    const [userData, setUserData] = useState('');
    const [error, setError] = useState('');
    
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

    useEffect(() => {
        // Fetch top anime if typeDefault is "topAnime"
        if (typeDefault === "topAnime") {
            fetchTopAnime();
        }
    }, [typeDefault]);

    const fetchAnime = async (query) => {
        try {
            const search = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&sfw&genres_exclude=9,49,12`)
                .then(res => res.json());
            
            if (search.status === 429)
                throw new Error('Too many requests');
            
            if (search && search.data) {
                const filteredData = search.data.filter(anime => {
                    return (anime.type === 'TV' || anime.type === 'Movie') && anime.source === 'Manga';
                });
                setAnimeList(filteredData);
            }
            else {
                console.error('Data structure not as expected: ', search);
            }
        }
        catch (error) {
            console.error('Error fetching search anime: ', error);
        }
    };

    const fetchTopAnime = async () => {
        const temp = await fetch(`https://api.jikan.moe/v4/anime`)
            .then(res => res.json());
        setAnimeFound(temp.data);
    };
    
    
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        fetchAnime(search);
    };

    const CustomPrimaryButton = styled.button`
        background-color: #111920;
        border: none;
        transition: all 0.3s ease;

        &:hover,
        &:focus {
        border: 2px solid white;
        transform: scale(1.05);
        }
  `;

    return (
        <div className="">
            <h1 className='text-white text-center p-2'>Welcome, {userData.first}</h1>
            <div className="search-bar-wrapper d-flex justify-content-center align-items-center" style={{ width: '100%' }}>
                <form className='text-center p-4 d-flex align-items-center text-white' style={{ maxWidth: '500px', width: '100%' }}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search anime..."
                        className="form-control rounded text-black mr-2" 
                        style={{ flex: '1' }} 
                    />
                    <CustomPrimaryButton className='btn text-white' style={{backgroundColor: '#111920', marginLeft: '5px'}} type="submit" onClick={handleSubmit} >Search</CustomPrimaryButton> 
                </form>
            </div>
            <BrowseContent
                animeList={search ? animeList : animeFound}
            />
        </div>
    )
}

export default AnimeSearch;
