import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import React, { PureComponent } from 'react';
import AnimeListing from './AnimeListing';
import { Dimensions } from 'react-native';
import { debounce, throttle } from '../functions/function';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class CurrentSeason extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            seasonAnime: []
        };
    }

    componentDidMount() {
        var startTime = performance.now();
        // Throttle the API call to avoid hitting rate limits
        this.throttledGetSeasonAnime = debounce(this.getSeasonAnime, 1000); // Adjust the delay as needed
        this.throttledGetSeasonAnime();
        var endTime = performance.now();
        console.log(`Call to fetch season anime took ${endTime - startTime} milliseconds`);
    }

    getSeasonAnime = async () => {
        try {
            const response = await axios.get('https://api.jikan.moe/v4/seasons/now?sfw');
            
            if (response.status !== 200) {
                console.log(response);
                throw new Error('Network response was not ok');
            }
            const temp = response.data;
            if (temp && temp.data) {
                this.setState({ seasonAnime: temp.data.slice(0, 25) });
            } else {
                console.error('Data structure is not as expected:', data);
            }
        } catch (error) {
            console.error('Error fetching season anime:', error);
        }
    }

    render() {
        const { seasonAnime } = this.state;

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

export default CurrentSeason;
