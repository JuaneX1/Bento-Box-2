import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList,ScrollView, Dimensions, SafeAreaView } from 'react-native';
import SwipeableAnimeCard from '../Components/SwipeableAnimeCard';
import { fetchRecommendations } from '../api/fetchRecommendations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimeListing from '../Components/AnimeListing';
import AnimeListingV2 from '../Components/AnimeListingV2';
import Carousel from 'react-native-snap-carousel';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const RecommendationsScreen = () => {
  const [animeData, setAnimeData] = useState(null); // Initialize as null

  useEffect(() => {
    fetchAnime();
  }, []);

  const fetchAnime = async () => {
    try {
      const cachedData = await AsyncStorage.getItem('recommendedList');
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        // Check if cached data has expired (e.g., cache duration is 1 day)
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setAnimeData(data); // No need to parse again
          return; // Exit early if cached data is still valid
        }
      }

      const favoritesString = await AsyncStorage.getItem('favorites');
      const favorites = JSON.parse(favoritesString);

      if (!favorites || favorites.length === 0) {
        throw new Error('No favorites found.');
      }

      const randomIndex = Math.floor(Math.random() * favorites.length);
      const randomItem = favorites[randomIndex];

      // Fetch recommendations based on the random item's mal_id
      const recommendations = await fetchRecommendations({ id: randomItem.mal_id });

      // Store recommendations in AsyncStorage
      const timestamp = Date.now();
      await AsyncStorage.setItem('recommendedAnime', JSON.stringify({ data: recommendations, timestamp }));

      // Set animeData state with the fetched recommendations
      setAnimeData(recommendations);
    } catch (error) {
      console.error('Error fetching anime:', error);
    }
  };

  if(animeData){
    console.log(animeData);
    return(
    <SafeAreaView style={styles.containerX}>
    
    <Carousel
                      slideStyle={{display:'flex', alignItems:'center'}}
                        data={animeData} // Use searchList from props
                        keyExtractor={(item) => item.mal_id ?  item.mal_id + Math.random() : Math.random()} // Use toString() to ensure key is a string
                        firstItem={2}
                        sliderWidth={windowWidth}
                        itemWidth={windowWidth*0.62}
                        inactiveSlideOpacity={0.4}
                        renderItem={({ item }) => (
                            <AnimeListingV2 anime={item.entry} />
                        )}>
                   </Carousel>
                 
    </SafeAreaView>
    );
  }
  else{
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
  }
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111920',
  },
  containerX: {
    flex: 1,
    width:windowWidth,
    height:windowHeight,
    backgroundColor: '#111920',
  },
});

export default RecommendationsScreen;
