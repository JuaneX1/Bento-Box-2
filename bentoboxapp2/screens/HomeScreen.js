import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, FlatList,TouchableOpacity,SafeAreaView,ActivityIndicator, ScrollView, Button } from 'react-native';
import React, { useEffect, useCallback,useState } from 'react'; // Import useEffect and useState
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
  const { userInfo, setUserInfo,favorite, setFavorite } = useAuth();
  const [animeData, setAnimeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const fetchData = useCallback(async () => {
    let isActive = true;  // Flag to indicate the component is mounted
    setIsLoading(true);
  
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error("No token found.");
      if (isActive) setIsLoading(false);
      return;
    }
  
    try {
      const { data } = await instance.get('/info', {
        headers: { Authorization: token }
      });
      if (isActive) {
        setUserInfo(data);
        const { data: favoritesData } = await instance.get('/getFavorite', { headers: { Authorization: await AsyncStorage.getItem('token') } });
        setFavorite(favoritesData);
        const details = await Promise.all(favoritesData.map(async (fav) => {
          const response = await axios.get(`https://api.jikan.moe/v4/anime/${fav}`);
          return response.data.data;
        }));
        setAnimeData(details);
      }
    } catch (error) {
      if(error.response && error.response.status !== 404){
        console.error('Error fetching anime:', error);
      } else {
        console.log("no favorites");
      }
      if (isActive) {
        setFavorite([]);
        setAnimeData(null);
      }
    }
    if (isActive) setIsLoading(false);
  
    // Cleanup function
    return () => {
      isActive = false;
    };
  }, [setUserInfo, setFavorite]);  // Dependencies
  
  

  useEffect(() => {
    fetchData();
  }, [handleRefresh]);

  const handleRefresh = () => {
    fetchData(); // Directly invoke fetching data
  };
   // Toggle the state to re-run the effect

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
                  <AnimeListing anime={item} />
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
 
