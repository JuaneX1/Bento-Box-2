import React, { PureComponent } from 'react';
import { Dimensions, Linking, TouchableOpacity, ScrollView, StyleSheet, Text, View, Image, FlatList } from 'react-native'; // Import withNavigation
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { formatPlot, ratingFormat } from '../functions/function.js';
import tw from 'twrnc';
import { addFavorites } from '../api/addFavorites.js';
import { getFavorites } from '../api/getFavorites.js';
import axios from 'axios';
import AxiosRateLimit from 'axios-rate-limit';
import AnimeListingV2 from '../Components/AnimeListingV2.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const axiosInstance = axios.create();

// Apply rate limiting to the axios instance
const axiosWithRateLimit = AxiosRateLimit(axiosInstance, { maxRequests: 1, perMilliseconds: 3000 }); // Example: 1 request per 1 seconds

class AnimeInfoScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            recommendations: [],
            favorite: false,
            loading: true
        };
    }

    componentDidMount() {
        this.fetchData();
    }
    componentDidUpdate(prevProps) {
        const { anime: currentAnime } = this.props.route.params;
        const { anime: previousAnime } = prevProps.route.params;
        // Example condition: fetch new recommendations if the 'userId' prop changes
        if (currentAnime && currentAnime.mal_id !== previousAnime.mal_id) {
            this.fetchData();
        }
    }

    fetchData = async () => {// Access navigation from props
        const { route } = this.props;
        const { anime } = route.params;
        try {
            let t = await AsyncStorage.getItem(`token`);
            let favs = getFavorites(t);

            if (favs.favorite != null) {
                const favorites = favs.favorite;
                this.setState({ favorite: favorites.some(item => item.mal_id === anime.mal_id) });
            }
        } catch (error) {
            console.error('Error adding favorites:', error);
        }

        try {
            console.log(anime.title);
            console.log(anime.mal_id);
            const cachedData = await AsyncStorage.getItem(`recommendations_${anime.mal_id}`);
            if (cachedData) {
                const { data, timestamp } = JSON.parse(cachedData);
                if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                    this.setState({ recommendations: data });
                }
            }

            const response = await axiosWithRateLimit.get(`https://api.jikan.moe/v4/anime/${anime.mal_id}/recommendations`);
            const data = response.data;
            if (data && data.data) {
                const timestamp = Date.now();
                const animeRecommendationsList = data.data.slice(0, 4);
                await AsyncStorage.setItem(`recommendations_${anime.mal_id}`, JSON.stringify({ data: animeRecommendationsList, timestamp }));
                this.setState({ recommendations: animeRecommendationsList });
            }

            this.setState({ loading: false });
        } catch (error) {
            console.error('Error fetching anime recommendations:', error);
            this.setState({ loading: false });
        }
    };

    toggleFavorite = async () => {
        const { route } = this.props;
        const { anime } = route.params;
        const { favorite } = this.state;
        this.setState({ favorite: !favorite });

        if (!favorite) {
            try {
                let t = await AsyncStorage.getItem(`token`);
                let s = await addFavorites(t, anime.mal_id);
                console.log(s);
                if (s.verdict === true) {
                    console.log('ADDED!');
                }
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

    openLink = async (url) => {
        try {
            await Linking.openURL(url);
        } catch (error) {
            console.error('Error opening link:', error);
        }
    };

    getScoreTextColor = (score) => {
        if (score >= 8) {
            return '#00ff00'; // Green color for high scores
        } else if (score >= 6) {
            return '#ff8c00'; // Orange color for medium scores
        } else if (score > 0) {
            return '#ff0000'; // Red color for low scores
        } else {
            return '#FFFFFF';
        }
    };

    render() {
        const { route, navigation } = this.props;
        const { anime } = route.params;
       
        const { recommendations, favorite, loading } = this.state;

        if (!anime) {
            return (
                <View style={styles.card}>
                    <Text>Anime data not available.</Text>
                </View>
            );
        }

        return (
            <ScrollView style={{ height: windowHeight }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.searchButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.likeButton} onPress={this.toggleFavorite}>
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
                        {anime.type === 'TV' ? `Episodes: ${anime.episodes}` : `${anime.duration}`}
                        {' · '}{anime.aired.prop.from.year}{' · '}{ratingFormat(anime.rating)}
                    </Text>
                    <View style={styles.genreBox}>
                        {anime.genres.map(genre => (
                            <Text key={genre.mal_id} style={styles.genre}>
                                {genre.name}
                            </Text>
                        ))}
                    </View>
                    <View style={{ alignItems: 'center', width: windowWidth }}>

                        {anime.trailer.url ?
                            <TouchableOpacity style={tw`bg-red-500 p-2 rounded-lg w-24`} onPress={() => this.openLink(anime.trailer.url)}>
                                <Text style={tw`text-white font-bold text-center`}>Trailer</Text>
                            </TouchableOpacity>
                            : <Text > No Trailer available</Text>}

                    </View>
                    <Text style={styles.plot}>{"     "}{formatPlot(anime.synopsis)}</Text>

                    <View style={{ alignContent: 'center', width: windowWidth, position: 'relative', flexDirection: 'row' }}>
                        <View style={styles.statsBox}>
                            <Text style={styles.statsTitle}>Score: </Text>
                            <Text style={{ fontWeight: '600', fontSize: 32, color: this.getScoreTextColor(anime.score) }}>
                                {anime.score == 0 || anime.score == null ? 'NaN' : anime.score}</Text>
                        </View>
                        <View style={styles.statsBox}>
                            <Text style={styles.statsTitle}>Rank: </Text>
                            <Text style={{ fontWeight: '600', fontSize: 32, color: "#ffffff" }}>
                                {anime.rank == 0 || anime.rank == null ? 'NaN' : anime.rank}</Text>
                        </View>
                        <View style={styles.statsBox}>
                            <Text style={styles.statsTitle}>Popularity: </Text>
                            <Text style={{ fontWeight: '600', fontSize: 32, color: "#ffffff" }}>
                                {anime.popularity == 0 || anime.popularity == null ? 'NaN' : anime.popularity}</Text>
                        </View>
                    </View>
                    {loading ? (
                        <Text>Loading...</Text>
                    ) : recommendations.length > 0 ? (
                        <View style={styles.recommendationsContainer}>
                            <Text style={styles.recommendationsTitle}>You Might Also Like:</Text>
                            <FlatList
                                horizontal={true}
                                style={styles.recommendationsList}
                                data={recommendations}
                                renderItem={({ item }) => (
                                    <AnimeListingV2 anime={item.entry}/>
                                   /* <TouchableOpacity
                                        key={item.entry.mal_id}
                                        //onPress={() => navigation.navigate('AnimeDetails', { id: recommendation.entry.mal_id })}
                                        style={styles.recommendationItem}
                                    >
                                        <Image
                                            source={{ uri: item.entry.images.jpg.image_url }}
                                            style={styles.recommendationImage}
                                        />
                                        <Text style={styles.recommendationTitle}>{item.entry.title}</Text>
                                    </TouchableOpacity>*/
                                )}
                            />
                        </View>
                    ) : (
                        <View style={styles.recommendationsContainer}>
                            <Text style={styles.recommendationsTitle}>No recommendations at the Moment:</Text>
                        </View>
                    )
                    }
                </View>
            </ScrollView>
        );
    }
}

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
        position: 'relative'
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
        backgroundColor: '#050301'
    },
    recommendationsContainer: {
        marginTop: 20,
        marginBottom: 10
      },
      recommendationsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      recommendationsList: {
        flexDirection: 'row',
        marginBottom: 20,
      }, recommendationItem: {
        marginRight: 10,
        alignItems: 'center',
      },
      recommendationImage: {
        width: 120,
        height: 180,
        borderRadius: 8,
      },
      recommendationTitle: {
        marginTop: 5,
        textAlign: 'center',
      },
});

export default AnimeInfoScreen;
