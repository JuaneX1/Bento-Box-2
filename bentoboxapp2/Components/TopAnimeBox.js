import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import AnimeListing from './AnimeListing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTopAnime } from '../api/fetchTopAnime'; // Import the fetchTopAnime function

class TopAnimeBox extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            topAnime: []
        };
    }

    componentDidMount() {
        this.loadTopAnime(); // Call the function to load top anime data
    }

    loadTopAnime = async () => {
        try {
            const topAnimeData = await fetchTopAnime(); // Call the fetchTopAnime function
            this.setState({ topAnime: topAnimeData }); // Update state with fetched data
        } catch (error) {
            console.error('Error loading top anime:', error);
        }
    };

    render() {
        const { topAnime } = this.state;

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
    }
});

export default TopAnimeBox;
