import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

export default function HomeScreen({ navigation }) {
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
    <View style={styles.container}>
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
    </View>
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
