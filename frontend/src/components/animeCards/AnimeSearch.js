import React, { useEffect, useState } from 'react';
import BrowseContent from '../pageFeatures/BrowseContent'
import styled from 'styled-components';
import { searchAnime, fetchTopAnime } from '../../utils/fetchAniList';

function AnimeSearch({ typeDefault }) {
    const [animeList, setAnimeList] = useState([]);
    const [search, setSearch] = useState("");
    const [animeFound, setAnimeFound] = useState([]);

    useEffect(() => {
        // Fetch top anime if typeDefault is "topAnime"
        if (typeDefault === "topAnime") {
            loadTopAnime();
        }
    }, [typeDefault]);

    const fetchAnime = async (query) => {
        try {
            const results = await searchAnime(query);
            setAnimeList(results);
        } catch (error) {
            console.error('Error fetching search anime: ', error);
        }
    };

    const loadTopAnime = async () => {
        try {
            const results = await fetchTopAnime();
            setAnimeFound(results);
        } catch (error) {
            console.error('Error fetching top anime:', error);
        }
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
        }
  `;

    return (
        <div className="">
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
