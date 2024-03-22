import React from 'react'
import AnimeCard from './AnimeCard'
import './MainContent.css'

function MainContent(props) {
    return (
        <main>
            <div className="main-head">
                <h1 className="browse-title">Browse</h1> {}
                <form 
                    className='search-box'
                    onSubmit={props.HandleSearch}>
                    <input 
                        type="search"
                        placeholder="Search for an anime..."
                        required 
                        value={props.search}
                        onChange={e => props.SetSearch(e.target.value)}/>
                </form>
            </div>
            <div className="anime-list">
                {props.animeList.map(anime => (
                    <AnimeCard
                        anime={anime}
                        key={anime.mal_id} />
                ))}
            </div>
        </main>
    )
}

export default MainContent
