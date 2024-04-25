import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList,StyleSheet, ScrollView, Dimensions, SafeAreaView, Text } from 'react-native';
import AnimeListingV2 from '../Components/AnimeListingV2';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons'; // Add this import statement
import { fetchRecommendations } from '../api/fetchRecommendations';
import { useAuth } from '../Components/AuthContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const instance = axios.create({
  baseURL: 'https://bento-box-2-df32a7e90651.herokuapp.com/api'
});

const RecommendationsScreen = () => {
  const [animeData, setAnimeData] = useState(null);
  const {userInfo, setUserInfo, authData, favorite, setFavorite} = useAuth();

  useEffect(() => {

    fetchAnime();

    
  }, [favorite]);

  const fetchAnime = useCallback(async () => {
    try {
      
     const cachedData = await AsyncStorage.getItem(`recommendedAnimeItem_${authData}`);
      if (cachedData ) {
        console.log("cache");
        const { data, timestamp } = JSON.parse(cachedData);
        {data !=null}{
          console.log("data is: ");
        // Check if cached data has expired (e.g., cache duration is 1 day)
        if (Date.now() - timestamp < 24 * 60 * 60* 1000) {
          setAnimeData(data); // No need to parse again
          console.log(favorite);
          return; // Exit early if cached data is still valid
        }
        }
        
      }

      const favsResponse = await instance.get(`/getFavorite`,  {
       
        headers: {
          Authorization: await AsyncStorage.getItem('token')
        }
      });
        
        const  f  = favsResponse.data;

        console.log(f);
        setFavorite(f);
      const randomIndex = Math.floor(Math.random() * f.length);
      console.log("index = "+randomIndex);
      const randomItem = f[randomIndex];
      console.log("rand ani = "+randomItem);
      // Fetch recommendations based on the random item's mal_id
      
      const recommendations = await fetchRecommendations({ id: randomItem, uD:authData });

      console.log(recommendations);
      // Store recommendations in AsyncStorage
      const timestamp = Date.now();
      await AsyncStorage.setItem(`recommendedAnime_${authData}`, JSON.stringify({ data: recommendations, timestamp }));

      // Set animeData state with the fetched recommendations
      setAnimeData(recommendations);
      return;
    } catch (error) {
      if(error.response && error.response.status !== 404){
        console.log("no favoritesbbb");
        console.error('Error fetching anime:', error);
        
        
      }else{
        console.log("no favorites");
        console.error('Error fetching anime:', error);
        setAnimeData(null);
      }
     
    }
  });

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
            <Text style={styles.headerText}>For You!</Text>
            <Text style={styles.infoText}>Here’s our pick for today. Come back tomorrow to see what else we have for you!</Text>
            <View style={styles.animeContainer}>
                  <AnimeListingV2 anime={animeData.entry} />
                
            </View>
          </>
        ) : (
          <View>
          <Text style={styles.headerText}>For You!</Text>
            <View style={styles.animeContainer}>
              <MaterialIcons name="sentiment-neutral" size={72} color="#fff" style={styles.sadIcon} />
              <Text style={styles.headerText}>Daily Pick</Text>
              <Text style={styles.noFavoritesText}>Oops no favorites found.</Text>
              <Text style={styles.noFavoritesText}>Continue exploring and add some favorites</Text>
              <Text style={styles.noFavoritesText}>so we can recommend you a daily pick !</Text>
            </View>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    marginTop: 20,
    marginLeft:15
  },
  infoText: {
    fontSize: 20,
    color: '#fff',
    fontWeight:'600',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20
  },
  animeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:30,
    alignSelf:'center',
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
