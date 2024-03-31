import React from 'react'
import './css/AnimeCard.css'

function AnimeCard({anime}) {
    return (
        <article className="anime-card">
            <a
                href={anime.url}
                target ="_blank"
                rel="norefererr">
                <figure>
                    <img src={anime.images.jpg.image_url} alt="AnimeImage" />
                </figure>
                <h3>{ anime.title }</h3>
            </a>
        </article>
    )
}

export default AnimeCard