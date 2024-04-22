import React, { useEffect, useState } from 'react';
import highScoreImage from '../../assets/highScoreImg.webp';
import lowScoreImage from '../../assets/lowScoreImg.png';
import mediumScoreImage from '../../assets/mediumScoreImg.png';
import { instance } from '../../App';

const DailyBox = () => {
    const [recommendedAnime, setRecommendedAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    let ignore = false; // Declare ignore variable here

    useEffect(() => {
        let isMounted = true; // Declare isMounted variable to check component's mounted state

        async function fetchFavorites() {
            if (!isMounted) return; // Check if component is unmounted

            try {
                const favoritesArr = await instance.get(`/getFavorite`, { headers: { Authorization: sessionStorage.getItem('token') } });
                setFavorites(favoritesArr.data);
            } catch (error) {
                console.error("Error fetching favorites:", error);
            }
        }

        fetchFavorites();

        return () => {
            isMounted = false; // Update isMounted when component unmounts
        };
    }, []);

    useEffect(() => {
        async function fetchRecommendation() {
            if (favorites.length === 0) return; // If favorites array is empty, no need to fetch recommendations
        
            try {
                let recommendedAnimeId = null;
        
                // Continue fetching recommendations until a valid recommendation is found
                while (!recommendedAnimeId) {
                    const randomIndex = Math.floor(Math.random() * favorites.length);
                    recommendedAnimeId = favorites[randomIndex];
        
                    // Fetch details of the randomly selected anime
                    const response = await instance.get(`https://api.jikan.moe/v4/anime/${recommendedAnimeId}/recommendations`);
                    const data = response.data;
                    const animeRecommendationsList = data.data;

                    // Iterate through each recommendation
                    for (let anime of animeRecommendationsList) {
                        // Extract the mal_id from the entry object
                        const malId = anime.entry.mal_id;
                        
                        // Check if the recommended anime is not in favorites
                        if (!favorites.find(favorite => favorite.mal_id === malId)) {
                            setRecommendedAnime(anime.entry);
                            setLoading(false);
                            return; // Exit loop if a recommendation not in favorites is found
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching recommendation:", error);
            }
        }        

        fetchRecommendation();

        return () => {
            ignore = true; // Update ignore when component unmounts
        };
    }, [favorites]);

    return (
        <div>
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                <div className="anime-info" key={recommendedAnime.mal_id}>
                    <img src={recommendedAnime.images.jpg.image_url} alt={"anime pic"} />
                    <div className="anime-synopsis-box">
                        <h1>{recommendedAnime.title}</h1>
                        <div className="synopsis-content">
                            <p className="anime-synopsis">Insert synopsis here</p>
                        </div>
                    </div>

                    <div className="score-box">
                        <h2>Overall Rating</h2>
                        <h3>Insert score here / 10</h3>
                        {/* Update images based on score */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailyBox;
