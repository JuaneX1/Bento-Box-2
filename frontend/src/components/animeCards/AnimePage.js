import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AnimePage = () => {
  const { id } = useParams();
  const [animeData, setAnimeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
        const data = response.data;
        const anime = data.data;
        setAnimeData(data.data);
        setLoading(false);
      }
      catch (error) {
        console.error('Error fetching anime details:', error);
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      {animeData ? (
        <h1>Anime = {animeData.title}</h1>
      ) : (
        <h1>No Data Available</h1>
      )}
    </div>
  );
};

export default AnimePage;
