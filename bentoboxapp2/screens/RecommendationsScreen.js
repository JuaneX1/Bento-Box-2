import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import SwipeableAnimeCard from '../Components/SwipeableAnimeCard';

const RecommendationsScreen = () => {
  const [animeData, setAnimeData] = useState(null); // Initialize as null

  useEffect(() => {
    fetchAnime();
  }, []);

  const fetchAnime = async () => {
    try {
      const response = await fetch('https://api.jikan.moe/v4/random/anime?limit=1'); 
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data && data.data) {
        setAnimeData(data.data); 
      } else {
        throw new Error('Invalid anime data');
      }
    } catch (error) {
      console.error('Error fetching anime:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {animeData && (
          <SwipeableAnimeCard
            key={animeData.mal_id}
            anime={animeData}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111920',
  },
});

export default RecommendationsScreen;
