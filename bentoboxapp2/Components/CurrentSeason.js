import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import React, { PureComponent } from 'react';
import AnimeListing from './AnimeListing';
import { Dimensions } from 'react-native';
import { debounce, throttle } from '../functions/function';
import axios from 'axios';
import { fetchCurrentSeason } from '../api/fetchCurrentSeason';
import LoadingScreen from '../screens/LoadingScreen';
import Loading from '../screens/LoadingScreen';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class CurrentSeason extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            seasonAnime: [],
            loading: true
        };
    }

    componentDidMount() {
        this.loadCurrentAnime();
    }

    loadCurrentAnime = async () => {
        try {
            const currentSeasonAnimeData = await fetchCurrentSeason(); // Call the fetchTopAnime function
            this.setState({ seasonAnime: currentSeasonAnimeData, loading: false }); // Update state with fetched data
        } catch (error) {
            console.error('Error loading current anime:', error);
            this.setState({ loading: false });
        }
    };

    render() {
        const { seasonAnime, loading } = this.state;

        if (loading) {
            return (
                <Loading/>
            );
        }

        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>
                  Currently Airing
                </Text>
                <FlatList
                    keyExtractor={(item) => item.mal_id}
                    horizontal={true}
                    data={seasonAnime}
                    renderItem={({ item }) => (
                        <AnimeListing
                            anime={item} />
                    )} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerText: {
        color: "#fff",
        height: windowHeight / 22,
        fontSize: 25,
        marginLeft: windowWidth / 50,
        fontWeight: 'bold'
    },
    animeText: {
        fontSize: 12,
        color: "#fff"
    },
    animeImages: {
        width: 50,
        height: 100
    },
    container: {
        justifyContent: "flex-start",
        marginTop: windowHeight / 100
    }
});

export default CurrentSeason;
