import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import React, { PureComponent } from 'react';
import AnimeListing from './AnimeListing';
import { debounce } from '../functions/function';
import { Dimensions } from 'react-native';
import axios from 'axios';
import { fetchUpcoming } from '../api/fetchUpcoming';
import Loading from '../screens/LoadingScreen';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class UpcomingAnime extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            upcomingAnime: [],
            loading: true
        };
    }

    componentDidMount() {
        this.loadUpcomingAnime();
    }

    loadUpcomingAnime = async () => {
        try {
            const upcomingAnimeData = await fetchUpcoming(); // Call the fetchTopAnime function
            this.setState({ upcomingAnime: upcomingAnimeData,loading: false }); // Update state with fetched data
        } catch (error) {
            console.error('Error loading top anime:', error);
            this.setState({ loading: false });
        }
    };

    render() {
        const { upcomingAnime, loading } = this.state;

        if (loading) {
            return (
                <Loading/>
            );
        }

        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>
                   Upcoming
                </Text>
                <FlatList
                    keyExtractor={(item) => item.mal_id}
                    horizontal={true}
                    data={upcomingAnime}
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

export default UpcomingAnime;
