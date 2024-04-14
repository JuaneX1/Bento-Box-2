import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity,SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import AsyncStorage from '@react-native-async-storage/async-storage';
import FavoriteAnime from '../Components/FavoriteAnime';


export default function HomeScreen({ navigation }) {
  const [favorites, setFavorites] = useState(null); // State to store favorites

  // Fetch favorites from AsyncStorage when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const favoritesData = await AsyncStorage.getItem('favorites');
        if (favoritesData) {
          setFavorites(JSON.parse(favoritesData)); // Parse favoritesData to JSON
        }
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
      }
    };

    fetchData(); // Call fetchData function
  }, []); // Empty dependency array to run effect only once when component mounts

  // Handle navigation functions
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
      {favorites === null ? ( // Render based on the value of favorites
        <>
          <StatusBar style="auto" />
          <Text style={styles.title}>Welcome to Your App</Text>
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
      ) : (
        <>
          <Text style={styles.title}>My Favorites</Text>
          <FavoriteAnime favorites={favorites} />
        </>
      )}
    </View>
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
});
