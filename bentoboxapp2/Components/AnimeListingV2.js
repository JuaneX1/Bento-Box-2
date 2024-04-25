import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AxiosRateLimit from 'axios-rate-limit';

const axiosInstance = axios.create();

// Apply rate limiting to the axios instance
const axiosWithRateLimit = AxiosRateLimit(axiosInstance, { maxRequests: 1, perMilliseconds: 3000 }); // Example: 1 request per 1 seconds
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AnimeListingV2 = ({ anime }) => {
   
    
    const navigation = useNavigation();
    
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const title = anime.title;
    const truncatedTitle = title.length > 20 ? title.slice(0, 20) + '...' : title;
   
    useEffect(() => {
    const fetchAnime = async () => {
        try 
        {
            const cachedData = await AsyncStorage.getItem(`anime_${anime.mal_id}`);
            if (cachedData) {
                const { data, timestamp } = JSON.parse(cachedData);
                // Check if cached data has expired (e.g., cache duration is 1 hour)
                if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                    setInfo(data);
                    return data;
                }
            }
            
            
          const response = await axiosWithRateLimit.get(`https://api.jikan.moe/v4/anime/${anime.mal_id}`);
          const data = response.data;
          if(data && data.data){
            const timestamp = Date.now();
            const animeInfo = data.data;
            await AsyncStorage.setItem(`anime_${anime.mal_id}`, JSON.stringify({ data: animeInfo, timestamp }));
            setInfo(animeInfo);
            return info;
          }
  
          setInfo(null);
          setLoading(false);
        }
        catch (error)
        {
          console.error('Error fetching anime recommendations:', error);
          setLoading(false);
        }
      };

      fetchAnime();
    }, [anime]);
    return (
        <View style={styles.card} key={anime.mal_id ?  anime.mal_id + Math.random() :  Math.random()}>
            <TouchableOpacity onPress={() => {console.log("Touched!"),
                navigation.navigate('recInfo', { anime: info })}}>
                <Image style={styles.animeImages} source={{ uri: anime.images.jpg.image_url }} />
                <Text style={styles.animeTitleText}>{truncatedTitle}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    animeTitleText: {
        color: "#ffffff",
        zIndex: 2,
        alignSelf: 'center',
        fontWeight:'700'
    },
    animeImages: {
        width: 150,
        height:250,
        alignSelf: 'center',
        borderRadius:10,
    },
    card: {
        margin: windowWidth / 60,
        alignItems: 'center'
    }
});

export default AnimeListingV2;
