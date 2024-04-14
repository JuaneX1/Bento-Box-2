// BrowseContent.js
import React from 'react';
import AnimeCard from '../animeCards/AnimeCard';
import '../../css/BrowseContent.css';

function BrowseContent(props) {
    return (
        <main>
            <div className="main-head">
                <h1 className="browse-title">Search</h1>
                <form className='search-box' onSubmit={props.handleSearch}>
                    <input
                        type="search"
                        placeholder="Search a show"
                        required
                        value={props.search}
                        onChange={props.handleSearchChange} // Ensure handleSearchChange is passed here
                    />
                </form>
            </div>
            <div className="anime-list">
                {props.animeList.map(anime => (
                    <AnimeCard
                        anime={anime}
                        key={anime.mal_id}
                    />
                ))}
            </div>
        </main>
    );
}

export default BrowseContent;
