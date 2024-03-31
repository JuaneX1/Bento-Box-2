import React from 'react';

const AnimeInfo = (props) => {
    const {title, source, rank, score, popularity, members, status, rating, duration, synopsis} = props.animeInfo;

    return(
    <>
        <h1>{title}</h1>
        <p>{synopsis}</p>
    </>
    );
}

export default AnimeInfo;