import * as React from 'react';
import { Dimensions, TouchableOpacity, ScrollView, StyleSheet, Text, View, FlatList, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Ionicons, FontAwesome } from '@expo/vector-icons';
import { ratingFormat, formatDuration, formatPlot } from '../functions/function';
import { LinearGradient } from 'expo-linear-gradient';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const AnimeInfoScreen = ({ route }) => {
    const { anime } = route.params;
    const navigation = useNavigation();

    const [favorite, setFavorite] = React.useState(0);

    const s = Math.round(anime.score / 2);
    console.log(s);
    const stars = Array.from({ length: s }, (_, index) => index);
    // Check if anime object is defined before accessing its properties
    if (!anime) {
        return (
            <View style={styles.card}>
                <Text>Anime data not available.</Text>
            </View>
        );
    }

    // Function to determine text color based on score
    const getScoreTextColor = (score) => {
        if (score >= 8) {
            return '#00ff00'; // Green color for high scores
        } else if (score >= 6) {
            return '#ff8c00'; // Orange color for medium scores
        } else if (score > 0){
            return '#ff0000'; // Red color for low scores
        }else{
            return '#FFFFFF'
        }
    }

    return (
            <ScrollView>

                <TouchableOpacity
                    onPress={() =>
                        navigation.goBack()}
                    style={styles.searchButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.likeButton}>
                    <AntDesign
                        name="heart"
                        size={24}
                        color={favorite ? "red" : "white"}
                        onPress={() => setFavorite(favorite ? 0 : 1)}
                    />
                </TouchableOpacity>



                <Image style={styles.imageBackground} source={{ uri: anime.images.jpg.large_image_url }} />
                <LinearGradient
                    colors={['transparent', 'rgba(17,25,32,0.8)', 'rgba(17,25,32,1)']}
                    style={{ width: windowWidth, height: windowHeight * 0.55 }}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    position="absolute"
                />


                <View
                    style={styles.container}
                >

                    <View style={styles.titleBox}>
                        <Text style={styles.animeTitleText}> {anime.title_english ? anime.title_english : anime.title} </Text>
                    </View>

                    <Text
                        style={styles.animeSubTitle}
                    >{anime.type}{' · '}
                        {anime.type == 'TV' ? `Episodes: ${anime.episodes}` : `${formatDuration(anime.duration)} min`}
                        {' · '}{anime.aired.prop.from.year}{' · '}
                        {ratingFormat(anime.rating)}</Text>

                    <View style={styles.genreBox}>
                        {anime.genres.map((genre, index) => (
                            <Text key={genre.mal_id}
                                style={styles.genre}
                            >
                                {genre.name}{}
                            </Text>
                        ))}
                    </View>

                    <Text style={styles.plot}>{"     "}{formatPlot(anime.synopsis)}</Text>

                    <Text style={{ marginTop: 5 }}>Where to Watch</Text>
                    <View style={{alignContent:'center', width: windowWidth, flexDirection: 'row' }}>
                        <Text style={styles.scoreTitle}>Score: </Text>
                        <View style={styles.scoreBox}>
                            <Text style={{fontWeight:'600', fontSize: 32, color: getScoreTextColor(anime.score) }}>
                                {anime.score == 0 ? 'NaN' : anime.score}</Text>
                        </View>

                        {stars.map((item, index) => (
                            <AntDesign name="star" size={24} color="gold" key={index} />
                        ))}
                    </View>

                    <Text style={{ color: "#fff" }}>User Reviews</Text>
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
        marginTop: 20,
        position: 'absolute',
        justifyContent: 'center',
        zIndex: 2

    },
    likeButton: {
        alignSelf: 'flex-end',
        width: 35,
        height: 35,
        marginRight: 20,
        marginTop: 25,
        position: 'absolute',
        zIndex: 2

    },
    scoreTitle:{
        alignSelf:'flex-start',
        
    },
    scoreBox: {
        width: windowWidth/3.5,
        height: windowHeight/5.5,
        borderRadius:15,
        alignSelf:'flex-end',
        marginLeft:windowWidth-175,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2E3033'
    }
});

export default AnimeInfoScreen;
