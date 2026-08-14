import React from 'react';
import AnimeCard from '../animeCards/AnimeCard';

function BrowseContent({ animeList, isLoadingMore }) {
    return (
        <main className="compartment-grid d-flex flex-wrap justify-content-center gap-4 p-4">
            {animeList?.map((anime, index) => (
                <div key={anime.id} style={{ animationDelay: `${(index % 12) * 40}ms` }}>
                    <AnimeCard anime={anime} />
                </div>
            ))}
            {isLoadingMore && Array.from({ length: 6 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="compartment-skeleton" />
            ))}
        </main>
    );
}

export default BrowseContent;
