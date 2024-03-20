import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import React, { PureComponent } from 'react';
import AnimeListing from './AnimeListing';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class TopAnimeBox extends PureComponent {
    render() {
        const { topAnime } = this.props;
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
