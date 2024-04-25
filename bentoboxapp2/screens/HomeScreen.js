import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, FlatList,TouchableOpacity,SafeAreaView,ActivityIndicator, ScrollView, Button } from 'react-native';
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
import { FontAwesome } from '@expo/vector-icons';

// Import statements...
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const instance = axios.create({
  baseURL: 'https://bento-box-2-df32a7e90651.herokuapp.com/api'
});

const axiosInstance = axios.create();

// Apply rate limiting to the axios instance
const axiosWithRateLimit = AxiosRateLimit(axiosInstance, { maxRequests: 3, perMilliseconds: 1000 }); // Example: 1 request per 1 seconds
export default function HomeScreen({ navigation }) {
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  const [animeData, setanimeData]= useState([]);
  const { authData } = useAuth();
  const { userInfo, setUserInfo, favorite, setFavorite } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    let isActive = true;

     const areArraysEqualUnorderedAsync = async (array1, array2) =>{
      // Simulating fetch or asynchronous preparation of arrays
      console.log('checking if same: '+array1+' '+array2);
      if (array1.length !== array2.length) {
        console.log('false');
          return false;
      }
      console.log('true');
      return true;
    };
    const fetchAnimeDetails = async (favorites, token) => {
      console.log('Fetching details for favorites:', favorites);
      const details = [];
      for (const fav of favorites) {
          try {
              /*const cacheKey = `favorites_${authData}_${fav}`;
              const cachedData = await AsyncStorage.getItem(cacheKey);
  
              if (cachedData) {
                  const { data, timestamp } = JSON.parse(cachedData);
                  if (Date.now() - timestamp < 30 * 1000) { // Cached data is valid for 60 seconds
                      details.push(data);
                      continue; // Skip the API call if cached data is still valid
                  }
              }*/
            
              const response = await axios.get(`https://api.jikan.moe/v4/anime/${fav}`);
              const newData = response.data.data;
              const newTimestamp = Date.now();
  
              //await AsyncStorage.setItem(cacheKey, JSON.stringify({ data: newData, timestamp: newTimestamp }));
              details.push(newData);
          } catch (error) {
              console.error('Error fetching anime details for:', favorite, error);
              details.push(null); // Handle the error by pushing null or some error indicator
          }
  
          // Wait for 333 milliseconds before making the next request
          await new Promise(resolve => setTimeout(resolve, 335));
      }
      setanimeData(details.filter(detail => detail !== null)); // Filter out any null entries from the details array
  };

    const fetchData = async () => {
      try {
        console.log('Fetching favorites:');
        console.log(favorite);
        setIsLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.log("No token found.");
          return;
        }
        
       /* const cachedData = await AsyncStorage.getItem(`favorites_${authData}_${favorite}`);
        if (cachedData) {
          console.log("cache favorites");
          const { data, timestamp } = JSON.parse(cachedData);
          // Check if cached data has expired (e.g., cache duration is 1 day)
          if (Date.now() - timestamp < 30 * 1000) {
            setAnimeData(data); // No need to parse again
            return; // Exit early if cached data is still valid
          }
        }*/
        
          const { data } = await instance.get('/info', {
            headers: { Authorization: token }
          });
          if (isActive) setUserInfo(data);
        
  
        const { data: favoritesData } = await instance.get('/getFavorite', {
          headers: { Authorization: token }
        });
        
         console.log("favoriteData: "+ favoritesData);
          if (areArraysEqualUnorderedAsync(favorite, favoritesData)===false) {
            console.log("verdict is false!");
            setFavorite(favoritesData);
            console.log("favoriteData added: "+ favoritesData);
            console.log("fav+ "+favorite);
            fetchAnimeDetails(favorite, token);
            
          
        }else{
          console.log("verdict is true!");
          console.log("favoriteData added: "+ favoritesData);
          setFavorite(favoritesData);
          fetchAnimeDetails(favoritesData, token);
        }
      } catch (error) {
        if(error.response && error.response.status !== 404){
          console.error('Error fetching data:', error);
        }
        
        setanimeData(null);
      }finally {
        setIsLoading(false); // End loading
      }
    };
  
    fetchData();
  
    // Cleanup function to prevent setting state on unmounted component
    return () => {
      isActive = false; // Prevents state update on an unmounted component
    };
  }, [refresh]); // Consider what really needs to trigger a re-fetch

  const handleRefresh = () => {
    setRefresh(prev => !prev); // Toggle the state to re-run the effect
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
        { userInfo ? (
          <View style={{marginTop:20}}>
            <Text style={[styles.userFavorites, { textAlign: 'center' }]}>{userInfo ? `${userInfo.login}'s Favorites` : "User's Favorites"}</Text>
            <TouchableOpacity style={{borderRadius:10,alignSelf:'center',alignContent:'center', backgroundColor:"#3077b2",marginBottom:10,width:80,height:30}}onPress={handleRefresh}>
            <FontAwesome name="refresh" size={24} style ={{marginTop:3,alignSelf:'center'}}color="white" />
              </TouchableOpacity>
            {favorite.length === 0 ? (
              <View style={styles.noFavoritesContainer}>
                <Text style={styles.noFavoritesText}>Looks like you have no favorites at the moment</Text>
                <Text style={styles.noFavoritesText}>No worries, keep exploring!</Text>
                <MaterialIcons name="sentiment-neutral" size={48} color="#fff" style={styles.smileyIcon} />
              </View>
            ) : (
              <FlatList
                style={{ alignSelf:'center', alignContent:'center' }}
                data={animeData}
                keyExtractor={(item) => item.mal_id.toString()}
                numColumns={2}
                renderItem={({ item }) => (
                  <TouchableOpacity>
                  <AnimeListing anime={item} />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        ) : (
          null
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
 
