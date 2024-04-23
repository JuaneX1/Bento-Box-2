import React, { useState, useEffect } from 'react';
import { View, FlatList,StyleSheet, ScrollView, Dimensions, SafeAreaView, Text } from 'react-native';
import AnimeListingV2 from '../Components/AnimeListingV2';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel from 'react-native-snap-carousel'; // Import the Carousel component
import { MaterialIcons } from '@expo/vector-icons'; // Add this import statement
import { fetchRecommendations } from '../api/fetchRecommendations';

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

      //const favoritesString = await AsyncStorage.getItem('favorites');
      //const favorites = JSON.parse(favoritesString);

      /*if (!favorites || favorites.length === 0) {
        throw new Error('No favorites found.');
      }*/
      const favsResponse = await instance.get(`/getFavorite`,  {
       
        headers: {
          Authorization: await AsyncStorage.getItem('token')
        }
      });
        
        const  f  = favsResponse.data;

        const favs = [...f];
        if(favs != null){
          console.log(...f);
          //console.log("dfdsfdsf "+ JSON.stringify(f, null, 2));
          //await AsyncStorage.setItem(`favorites_`, JSON.stringify(f));
          //setFavorites(f);
        }
        else{
          console.log(f);
        }

      const randomIndex = Math.floor(Math.random() * favs.length);
      console.log(randomIndex);
      const randomItem = favs[randomIndex];
      console.log(randomItem);
      // Fetch recommendations based on the random item's mal_id
      const recommendations = await fetchRecommendations({ id: randomItem });
      console.log(recommendations);
      // Store recommendations in AsyncStorage
      const timestamp = Date.now();
      await AsyncStorage.setItem('recommendedAnime', JSON.stringify({ data: recommendations, timestamp }));

      // Set animeData state with the fetched recommendations
      setAnimeData(recommendations);
    } catch (error) {
      console.error('Error fetching anime:', error);
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
      <View contentContainerStyle={styles.scrollContent}>
        {animeData ? (
          <>
            <Text style={styles.headerText}>Daily Pick</Text>
            <Text style={styles.infoText}>Here’s our pick for today. Come back tomorrow to see what else we have for you!</Text>
            <View style={styles.animeContainer}>
                  <AnimeListingV2 anime={animeData.entry} />
                
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
      </View>
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
