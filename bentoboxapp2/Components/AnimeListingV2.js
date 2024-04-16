import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AnimeListingV2 = ({ anime }) => {
    const navigation = useNavigation();
    
    const title = anime.title;
    const truncatedTitle = title.length > 20 ? title.slice(0, 20) + '...' : title;
    console.log(title);
    return (
        <View style={styles.card} key={anime.mal_id ?  anime.mal_id + Math.random() :  Math.random()}>
            <TouchableOpacity >
                <Image style={styles.animeImages} source={{ uri: anime.images.jpg.image_url }} />
                <Text style={styles.animeTitleText}>{truncatedTitle}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    animeTitleText: {
        color: "#ffffff",
        zIndex: 2,
        alignSelf: 'center',
        fontWeight:'700'
    },
    animeImages: {
        width: 175,
        height:300,
        alignSelf: 'center'
    },
    card: {
        margin: windowWidth / 47,
        alignItems: 'center'
    }
});

export default AnimeListingV2;
