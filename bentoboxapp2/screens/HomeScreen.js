import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity,SafeAreaView,ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import AsyncStorage from '@react-native-async-storage/async-storage';
import FavoriteAnime from '../Components/FavoriteAnime';
import { useAuth } from '../Components/AuthContext';
import { getFavorites } from '../api/getFavorites';
// Import statements...

export default function HomeScreen({ navigation }) {
  const [favorites, setFavorites] = useState(null);
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
          let favs = getFavorites(t, u._id);

          console.log(favs);
          favs = favs.favorite;

          if(favs != null){
            setFavorites(favs);
          }

        } else {
          console.log("No user data found.");
        }
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
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
      <View style={styles.container}>
        {user ? (
          <>
            <Text>{user.login}'s Favorites</Text>
            {favorites === null ? (
              <Text>Looks like you have no favorites at the moment</Text>
            ) : (
              <Text>YAYYYYY!</Text>
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
      </View>
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
