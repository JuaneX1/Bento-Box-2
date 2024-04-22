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
// Import statements...
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const instance = axios.create({
  baseURL: 'https://bento-box-2-df32a7e90651.herokuapp.com/api'
});

const axiosInstance = axios.create();

// Apply rate limiting to the axios instance
const axiosWithRateLimit = AxiosRateLimit(axiosInstance, { maxRequests: 1, perMilliseconds: 1 }); // Example: 1 request per 1 seconds
export default function HomeScreen({ navigation }) {
  const [favorites, setFavorites] = useState(null);
  const [animeData, setanimeData]= useState([]);
  const [user, setUser] = useState(null);
  const { authData } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (authData) {
          let u = await AsyncStorage.getItem(`user_${authData}`);
          u = JSON.parse(u);
          setUser(u);
          let t = await AsyncStorage.getItem(`token`);
          if(t){
            console.log(t);
          }

          const cachedData = await AsyncStorage.getItem(`favorites_${authData}`);
          if (cachedData) {
              const { data, timestamp } = JSON.parse(cachedData);
              // Check if cached data has expired (e.g., cache duration is 1 hour)
              if (Date.now() - timestamp <60 * 1000) {
                setFavorites(JSON.parse(data));
              }
          }

          const favsResponse = await instance.get(`/getFavorite`,  {
       
            headers: {
              Authorization: await AsyncStorage.getItem('token')
            }
          });
            
            const  f  = favsResponse.data;

            if(f != null){
              //console.log("dfdsfdsf "+ JSON.stringify(favs.favorite, null, 2));
              await AsyncStorage.setItem(`favorites_${authData}`, JSON.stringify(f));
              setFavorites(f);
            }

            //const favoritesArr = f.map(favorite => favorite._id); // Assuming favorites have an _id property

            const animeDetails = await Promise.all(
              f.map(async favorite => {
                const cachedaniData = await AsyncStorage.getItem(`favorites_${authData}_${favorite}`);
                if (cachedaniData) {
                    const { data, timestamp } = JSON.parse(cachedData);
                    // Check if cached data has expired (e.g., cache duration is 1 hour)
                    if (Date.now() - timestamp <  60 * 1000) {
                      return JSON.parse(data);
                    }
                }
                const response = await axiosWithRateLimit.get(`https://api.jikan.moe/v4/anime/${favorite}`);
                await AsyncStorage.setItem(`favorites_${authData}_${favorite}`, JSON.stringify(response.data.data));
                return response.data.data;
              })
            );

            if(animeDetails != null){
              setanimeData(animeDetails);
            }
            else{
              console.log("oops!");
            }

          console.log("oasnos "+ JSON.stringify(f));
          //let {favorite, error} = getFavorites(t, u._id);

          //favs = favs.favorite;
         // console.log(JSON.stringify(favorite));

         

        } else {
          console.log("No user data found.");
        }
      } catch (error) {
        console.error('Error fetching data :', error.response.data);
      }
    };

    fetchData();
  }, [authData]);

  const handleLikedAnime = () => {
    navigation.navigate('LikedAnime');
  };

  const handleWatchedAnime = () => {
    navigation.navigate('WatchedAnime');
  };

  const handleCustomList = () => {
    navigation.navigate('CustomList');
  };

  return (
    <SafeAreaView style={styles.container}>
       <LinearGradient
                colors={['transparent', 'rgba(48, 119, 178, 0.5)', 'rgba(48, 119, 178, 1)']}
                style={{ width: windowWidth, height: windowHeight*0.60, transform: [{ translateY: windowHeight*0.20}]}}
                start={{ x: 0.5, y: 0.5}}
                end={{ x: 0.5, y: 1 }}
                position="absolute"
            />
      <ScrollView>
      
        {user ? (
          <>
            <Text>{user.login}'s Favorites</Text>
            {favorites === null ? (
              <Text>Looks like you have no favorites at the moment</Text>
            ) : (
              <FlatList
                 style={{width:windowWidth}}
                data={animeData} // Use searchList from props
                keyExtractor={(item) => item.mal_id.toString()} // Use toString() to ensure key is a string
                numColumns={2}
                renderItem={({ item }) => (
                    <AnimeListing anime={item} />
                )}>
              </FlatList>
             
            
              //<Text>YAYYYYY!</Text>
            )}
          </>
        ) : (
          <>
            <StatusBar style="auto" />
            <Text style={styles.title}>Welcome sdhiuda</Text>
            <TouchableOpacity style={styles.button} onPress={handleLikedAnime}>
              <Text style={styles.buttonText}>Liked Anime/Watchlist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleWatchedAnime}>
              <Text style={styles.buttonText}>Watched Anime</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCustomList}>
              <Text style={styles.buttonText}>Custom List</Text>
            </TouchableOpacity>
          </>
        )}
      
      </ScrollView>
    </SafeAreaView>
  );
  
}

// Styles...

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
});
