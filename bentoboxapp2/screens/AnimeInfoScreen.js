import * as React from 'react';
import { useState, useEffect } from 'react';
import { Dimensions, TouchableOpacity, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AnimeInfoScreen = ({ route }) => {
    const { anime } = route.params;
    const navigation = useNavigation();

    const [favorite, setFavorite] = useState(false);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const favoritesString = await AsyncStorage.getItem('favorites');
                if (favoritesString) {
                    const favorites = JSON.parse(favoritesString);
                    setFavorite(favorites.some(item => item.id === anime.mal_id));
                }
            } catch (error) {
                console.error('Error fetching favorites from AsyncStorage:', error);
            }
        };
    
        fetchFavorites();
    }, [anime]);

    const toggleFavorite = async () => {
        setFavorite(!favorite);
    
        if (!favorite) {
            try {
                const favoritesString = await AsyncStorage.getItem('favorites');
                let favorites = [];
                if (favoritesString) {
                    favorites = JSON.parse(favoritesString);
                }
                favorites.push(anime);
                await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
            } catch (error) {
                console.error('Error adding anime to favorites:', error);
            }
        } else {
            try {
                let favorites = [];
                const favoritesString = await AsyncStorage.getItem('favorites');
                if (favoritesString) {
                    favorites = JSON.parse(favoritesString);
                    favorites = favorites.filter(item => item.id !== anime.mal_id);
                    await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
                }
            } catch (error) {
                console.error('Error removing anime from favorites:', error);
            }
        }
    };

    if (!anime) {
        return (
            <View style={styles.card}>
                <Text>Anime data not available.</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.searchButton}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.likeButton} onPress={toggleFavorite}>
                <AntDesign name="heart" size={24} color={favorite ? "red" : "white"} />
            </TouchableOpacity>
            <Image style={styles.imageBackground} source={{ uri: anime.images.jpg.large_image_url }} />
            <LinearGradient
                colors={['transparent', 'rgba(17,25,32,0.8)', 'rgba(17,25,32,1)']}
                style={{ width: windowWidth, height: windowHeight * 0.55 }}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                position="absolute"
            />
            <View style={styles.container}>
                <View style={styles.titleBox}>
                    <Text style={styles.animeTitleText}> {anime.title_english ? anime.title_english : anime.title} </Text>
                </View>
                <Text style={styles.animeSubTitle}>
                    {anime.type}{' · '}
                    {anime.type === 'TV' ? `Episodes: ${anime.episodes}` : `${anime.duration} min`}
                    {' · '}{anime.aired.prop.from.year}{' · '}{anime.rating}
                </Text>
                <View style={styles.genreBox}>
                    {anime.genres.map(genre => (
                        <Text key={genre.mal_id} style={styles.genre}>
                            {genre.name}
                        </Text>
                    ))}
                </View>
                <Text style={styles.plot}>{anime.synopsis}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    animeTitleText: {
        color: "#ffffff",
        zIndex: 2,
        alignSelf: 'center',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 5
    },
    plot: {
        fontSize: 15,
        padding: 10,
        fontWeight: 'bold',
        color: "#e6e1e7",
    },
    animeSubTitle: {
        color: "#e6e1e7",
        textAlign: 'center',
        marginTop: 10,
        fontSize: 14,
        fontWeight: '600',
        padding: 5
    },
    imageBackground: {
        width: windowWidth,
        height: windowHeight * 0.55,
        alignSelf: 'center',

    },
    titleBox: {
        marginTop: -windowHeight * 0.09
    },
    poster: {
        width: 200,
        height: 300,
        alignSelf: 'center',
        transform: [{ translateY: 50 }],
        zIndex: 3
    },
    genreBox: {
        width: windowWidth, // Set the width to the screen width
        flexDirection: 'row',
        flexWrap: 'wrap', // Enable wrapping of items to the next row
        alignSelf: 'center',
        justifyContent: 'center', // Align items horizontally
    },
    genre: {
        padding: 5,
        margin: 5,
        color: "#e6e1e7",
        fontWeight: '500',
        fontSize: 12,
        textAlign: 'center', // Center the text horizontally
    },
    container: {
        backgroundColor: 'rgba(17,25,32, 1)',
        position: 'fixed'
    },
    searchButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 28,
        height: 30,
        borderRadius: 15,
        marginLeft: 20,
        marginTop: windowHeight / 19,
        position: 'absolute',
        justifyContent: 'center',
        zIndex: 2

    },
    likeButton: {
        alignSelf: 'flex-end',
        width: 35,
        height: 35,
        marginRight: 20,
        marginTop: windowHeight / 19,
        position: 'absolute',
        zIndex: 2

    },
    statsTitle: {
        alignSelf: 'center',
        color: "#ffffff",
        fontWeight: '600',
        fontSize: 20

    },
    statsBox: {
        width: windowWidth / 3.5,
        height: windowHeight / 5.5,
        borderRadius: 15,
        alignSelf: 'flex-end',
        marginLeft: windowWidth / 30,
        marginTop: 15,
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2E3033'
    },
});

export default AnimeInfoScreen;
