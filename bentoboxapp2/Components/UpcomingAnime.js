import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import React, { PureComponent } from 'react';
import AnimeListing from './AnimeListing';
import { debounce } from '../functions/function';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class UpcomingAnime extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            upcomingAnime: []
        };
    }

    componentDidMount() {
        var startTime = performance.now();
        this.throttledGetUpcomingAnime = debounce(this.getUpcomingAnime, 1000); // Adjust the delay as needed
        this.throttledGetUpcomingAnime();
        var endTime = performance.now();
        console.log(`Call to fetch upComing anime took ${endTime - startTime} milliseconds`);
    }

    getUpcomingAnime = async () => {
        try {
            const response = await fetch(`https://api.jikan.moe/v4/top/anime?sfw&filter=upcoming`);
            
            if (!response.ok) {
                console.log(response);
                throw new Error('Network response was not ok');
            }
            const temp = await response.json();
            if (temp && temp.data) {
                this.setState({ upcomingAnime: temp.data.slice(0, 25) });
            } else {
                console.error('Data structure is not as expected:', data);
            }
        } catch (error) {
            console.error('Error fetching Upcoming anime:', error);
        }
    }

    render() {
        const { upcomingAnime } = this.state;

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

export default UpcomingAnime;
