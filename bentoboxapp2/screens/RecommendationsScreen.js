import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList,ScrollView, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import SwipeableAnimeCard from '../Components/SwipeableAnimeCard';
import { fetchRecommendations } from '../api/fetchRecommendations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimeListing from '../Components/AnimeListing';
import AnimeListingV2 from '../Components/AnimeListingV2';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios';
import axiosRateLimit from 'axios-rate-limit';
import { LinearGradient } from 'expo-linear-gradient';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const instance = axios.create({
  baseURL: 'https://bento-box-2-df32a7e90651.herokuapp.com/api'
});


const RecommendationsScreen = () => {
  const [animeData, setAnimeData] = useState(null); // Initialize as null

  useEffect(() => {
    fetchAnime();
  }, []);

  const fetchAnime = async () => {
    try {
      const cachedData = await AsyncStorage.getItem('recommendedItem');
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        // Check if cached data has expired (e.g., cache duration is 1 day)
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setAnimeData(data); // No need to parse again
          return; // Exit early if cached data is still valid
        }
      }

      const favsResponse = await instance.get(`/getFavorite`,  {
       
        headers: {
          Authorization: await AsyncStorage.getItem('token')
        }
      });
        
      const  f  = favsResponse.data;

      if (!f || f.length === 0) {
        setAnimeData(null);
        throw new Error('No favorites found.');
      }
      else{
      const randomIndex = Math.floor(Math.random() * f.length);
      const randomItem = f[randomIndex];

      // Fetch recommendations based on the random item's mal_id
      const recommendations = await fetchRecommendations({ id: randomItem.mal_id });
      
      console.log('Raw response:', recommendations);

      const r = recommendations;//JSON.parse(recommendations);
      const randomRecIndex = Math.floor(Math.random() * r.length);
      const randomRecItem = r[randomRecIndex];
      // Store recommendations in AsyncStorage
      const timestamp = Date.now();

      await AsyncStorage.setItem('recommendedItem', JSON.stringify({ data: randomRecItem, timestamp }));

      // Set animeData state with the fetched recommendations
      setAnimeData(randomRecItem);
      }
    } catch (error) {
      console.error('Error fetching anime:', error);
    }
  };

  if(animeData){
    console.log(animeData);
    return(
    <SafeAreaView style={styles.containerX}>
       <LinearGradient
                colors={['transparent', 'rgba(48, 119, 178, 0.5)', 'rgba(48, 119, 178, 1)']}
                style={{ width: windowWidth, height: windowHeight*0.60, transform: [{ translateY: windowHeight*0.35}]}}
                start={{ x: 0.5, y: 0.5}}
                end={{ x: 0.5, y: 1 }}
                position="absolute"
            />
      <TouchableOpacity>
        <AnimeListingV2 anime={animeData.entry} />
      </TouchableOpacity>
                 
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
