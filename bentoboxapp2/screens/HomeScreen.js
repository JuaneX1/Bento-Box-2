import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, FlatList,TouchableOpacity,SafeAreaView,ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import AsyncStorage from '@react-native-async-storage/async-storage';
import FavoriteAnime from '../Components/FavoriteAnime';
import { useAuth } from '../Components/AuthContext';
import { getFavorites } from '../api/getFavorites';
import axios from 'axios';
import AnimeListing from '../Components/AnimeListing';
import { LinearGradient } from 'expo-linear-gradient';
import AxiosRateLimit from 'axios-rate-limit';
import { MaterialIcons } from '@expo/vector-icons'; // Add this import statement

// Import statements...
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const instance = axios.create({
  baseURL: 'https://bento-box-2-df32a7e90651.herokuapp.com/api'
});

const axiosInstance = axios.create();

// Apply rate limiting to the axios instance
const axiosWithRateLimit = AxiosRateLimit(axiosInstance, { maxRequests: 1, perMilliseconds: 1000 }); // Example: 1 request per 1 seconds
export default function HomeScreen({ navigation }) {
  const [favorites, setFavorites] = useState(null);
  const [animeData, setanimeData]= useState([]);
  const [user, setUser] = useState(null);
  const { authData } = useAuth();
  const { userInfo, setUserInfo, favorite, setFavorite } = useAuth();
  useEffect(() => {
    let isActive = true;
  
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.log("No token found.");
          return;
        }
  
        if (!userInfo) {
          const { data } = await instance.get('/info', {
            headers: { Authorization: token }
          });
          if (isActive) setUserInfo(data);
        }
  
        const { data: favoritesData } = await instance.get('/getFavorite', {
          headers: { Authorization: token }
        });
        if (isActive) {
          console.log(favoritesData[0]);
          setFavorite(favoritesData);
          console.log(favorite);
          fetchAnimeDetails(favoritesData, token);
        }
      } catch (error) {
        if(error.response.status === 404){
          setFavorite([]);
        }
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  
    // Cleanup function to prevent setting state on unmounted component
    return () => {
      isActive = false; // Prevents state update on an unmounted component
    };
  }, [userInfo, favorite]); // Consider what really needs to trigger a re-fetch

  const fetchAnimeDetails = async (favorites, token) => {
      
    const details = await Promise.all(favorites.map(async favorite => {
    try {
      const cachedaniData = await AsyncStorage.getItem(`favorites_${authData}_${favorite}`);

      if (cachedaniData) {
        
          console.log("cache!");
          try{
            console.log(cachedaniData);
            const { data, timestamp } = JSON.parse(cachedaniData);
            
            console.log('sdfsfs');
            if (Date.now() - timestamp < 60 * 1000) {

              return data;
  
            }
          }catch (e) {
            console.error("Failed to parse JSON:", e);
            return null;  // or return a default value or error indication as appropriate
          }

      }
      const response = await axiosWithRateLimit.get(`https://api.jikan.moe/v4/anime/${favorite}`);

      const timestamp = Date.now();


      await AsyncStorage.setItem(`favorites_${authData}_${favorite}`, JSON.stringify({ data: response.data.data, timestamp }));

      return response.data.data;
    } catch (error) {
      console.error('Error fetching anime details:', error);
      return null;
    }
  }));
   setanimeData(details.filter(detail => detail !== null));
};

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['transparent', 'rgba(48, 119, 178, 0.5)', 'rgba(48, 119, 178, 1)']}
        style={{ width: windowWidth, height: windowHeight * 0.60, transform: [{ translateY: windowHeight * 0.20 }] }}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
        position="absolute"
      />
        {userInfo ? (
          <>
            <Text style={[styles.userFavorites, { textAlign: 'center' }]}>{userInfo ? `${userInfo.login}'s Favorites` : "User's Favorites"}</Text>
            {favorite === null ? (
              <View style={styles.noFavoritesContainer}>
                <Text style={styles.noFavoritesText}>Looks like you have no favorites at the moment</Text>
                <Text style={styles.noFavoritesText}>No worries, keep exploring!</Text>
                <MaterialIcons name="sentiment-neutral" size={48} color="#fff" style={styles.smileyIcon} />
              </View>
            ) : (
              <FlatList
                style={{ width: windowWidth }}
                data={animeData}
                keyExtractor={(item) => item.mal_id.toString()}
                numColumns={2}
                renderItem={({ item }) => (
                  <AnimeListing anime={item} />
                )}
              />
            )}
          </>
        ) : (
          <>
            <StatusBar style="auto" />
            <Text style={styles.title}>Welcome sdhiuda</Text>
            
          </>
        )}
    </SafeAreaView>
  );
        }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#111920',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#3077b2',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 25,
      marginVertical: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    userFavorites: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 20,
    },
    noFavoritesContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    noFavoritesText: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center',
    },
    smileyIcon: {
      marginTop: 20,
    },
  });
 
