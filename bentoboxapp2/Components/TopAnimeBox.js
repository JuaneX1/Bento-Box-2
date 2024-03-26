import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import React, { PureComponent } from 'react';
import AnimeListing from './AnimeListing';
import { Dimensions } from 'react-native';
import { debounce } from '../functions/function';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class TopAnimeBox extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            topAnime: []
        };
    }

    componentDidMount() {
        this.throttledGetTopAnime = debounce(this.getTopAnime, 1000); // Adjust the delay as needed
        this.throttledGetTopAnime();
    }

    getTopAnime = async () => {
        try {
            const response = await axios.get('https://api.jikan.moe/v4/top/anime', {
                params: {
                    sfw: true,
                    filter: 'bypopularity'
                }
            });
            const data = response.data;
            if (data && data.data) {
                this.setState({ topAnime: data.data.slice(0, 25) });
            } else {
                console.error('Data structure is not as expected:', data);
            }
        } catch (error) {
            console.error('Error fetching top anime:', error);
        }
    }

    render() {
        const { topAnime } = this.state;

        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>Most Popular</Text>
                <FlatList
                    keyExtractor={(item) => item.mal_id}
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
        height: windowHeight / 25,
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

export default TopAnimeBox;