import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import tw from 'twrnc';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const AnimeListing = ({ anime }) => {
    const navigation = useNavigation();
    
    const title = anime.title_english ? anime.title_english : anime.title;
    const truncatedTitle = title.length > 20 ? title.slice(0, 20) + '...' : title;
    
    return (
        <View style={styles.card} key={anime.mal_id + Math.random()}>
            <TouchableOpacity onPress={() => navigation.navigate('Info', { anime: anime })}>
                <Image style={styles.animeImages} source={{ uri: anime.images.jpg.image_url }} />
                <Text style={[tw`text-white font-semibold text-center`]}>{truncatedTitle}</Text>
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
        width: 150,
        height:250,
        alignSelf: 'center',
        borderRadius:10,
    },
    card: {
        margin: windowWidth / 60,
        alignItems: 'center'
    }
});

export default AnimeListing;
