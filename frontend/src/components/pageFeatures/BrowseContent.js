import React from 'react';
import AnimeCard from '../animeCards/AnimeCard';

function BrowseContent(props) {
    return (
        <main className="container-fluid">
            <div className="row justify-content-center p-4">
            </div>
            <div className="row justify-content-center">
                <div className="col-sm-8">
                    <div className="anime-list row row-cols-1 row-cols-md-2 row-cols-lg-3 justify-content-center">
                        {props.animeList?.map(anime => (
                            <div key={anime.mal_id} className="col mb-5 d-flex justify-content-center">
                                <AnimeCard anime={anime} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default BrowseContent;
