import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import AnimeListing from './AnimeListing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTopAnime } from '../api/fetchTopAnime'; // Import the fetchTopAnime function
import LoadingScreen from '../screens/LoadingScreen';
import Loading from '../screens/LoadingScreen';

class TopAnimeBox extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            topAnime: [],
            loading: true // Add loading state
        };
    }

    componentDidMount() {
        this.loadTopAnime(); // Call the function to load top anime data
    }

    loadTopAnime = async () => {
        try {
            const topAnimeData = await fetchTopAnime(); // Call the fetchTopAnime function
            this.setState({ topAnime: topAnimeData, loading: false }); // Update state with fetched data and set loading to false
        } catch (error) {
            console.error('Error loading top anime:', error);
            this.setState({ loading: false }); // Set loading to false even if there's an error
        }
    };

    render() {
        const { topAnime, loading } = this.state;

        if (loading) {
            return (
                <Loading/>
            );
        }

        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>Most Popular</Text>
                <FlatList
                    keyExtractor={(item) => item.mal_id.toString()} // Ensure key is a string
                    horizontal={true}
                    data={topAnime}
                    renderItem={({ item }) => (
                        <AnimeListing anime={item} />
                    )}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerText: {
        color: "#fff",
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10
    },
    container: {
        marginTop: 10
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default TopAnimeBox;
