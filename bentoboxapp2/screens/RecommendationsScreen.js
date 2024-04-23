import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, SafeAreaView, Text } from 'react-native';
import AnimeListingV2 from '../Components/AnimeListingV2';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel from 'react-native-snap-carousel'; // Import the Carousel component
import { MaterialIcons } from '@expo/vector-icons'; // Add this import statement

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const instance = axios.create({
  baseURL: 'https://bento-box-2-df32a7e90651.herokuapp.com/api'
});

const RecommendationsScreen = () => {
  const [animeData, setAnimeData] = useState(null);

  useEffect(() => {
    fetchAnime();
  }, []);

  const fetchAnime = async () => {
    try {
      const cachedData = await AsyncStorage.getItem('recommendedAnime');
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

  const fetchRecommendations = async (params) => {
    try {
      const response = await instance.get('/recommendations', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['transparent', 'rgba(48, 119, 178, 0.5)', 'rgba(48, 119, 178, 1)']}
        style={{ width: windowWidth, height: windowHeight * 0.60, transform: [{ translateY: windowHeight * 0.36 }] }}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
        position="absolute"
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {animeData ? (
          <>
            <Text style={styles.headerText}>Daily Pick</Text>
            <Text style={styles.infoText}>Here’s our pick for today. Come back tomorrow to see what else we have for you!</Text>
            <View style={styles.animeContainer}>
              <Carousel
                containerCustomStyle={{ overflow: 'visible' }}
                slideStyle={{ display: 'flex', alignItems: 'center' }}
                data={animeData} // Use animeData directly
                keyExtractor={(item) => item.mal_id ? item.mal_id + Math.random() : Math.random()} // Use toString() to ensure key is a string
                firstItem={1}
                sliderWidth={windowWidth}
                itemWidth={windowWidth * 0.62}
                inactiveSlideOpacity={0.75}
                inactiveSlideScale={0.77}
                renderItem={({ item }) => (
                  <AnimeListingV2 anime={item.entry} />
                )}
              />
            </View>
          </>
        ) : (
          <View style={styles.animeContainer}>
            <MaterialIcons name="sentiment-neutral" size={72} color="#fff" style={styles.sadIcon} />
            <Text style={styles.headerText}>Daily Pick</Text>
            <Text style={styles.noFavoritesText}>Oops no favorites found.</Text>
            <Text style={styles.noFavoritesText}>Continue exploring and add some favorites</Text>
            <Text style={styles.noFavoritesText}>so we can recommend you a daily pick !</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111920',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  animeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  noFavoritesText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  sadIcon: {
    marginBottom: 20,
  },
});

export default RecommendationsScreen;
