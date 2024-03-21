import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image,FlatList } from 'react-native';
import React from 'react';
import AnimeListing from './AnimeListing';
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const StudioGhibliList = ({ ghibliAnime }) => {
   
    return (
        <View style={styles.container}>
            <Text
            style={styles.headerText}>
                Studio Ghibli Collection
            </Text>
             <FlatList
        keyExtractor={(item) => item.mal_id}
        horizontal={true}
        data={ghibliAnime}
        renderItem={({item}) =>(
                <AnimeListing
                anime={item}/>
        )}/>
        </View>
       
            
    
        
    );
}

const styles = StyleSheet.create({
    headerText: {
        color: "#fff",
        height: windowHeight/25,
        fontSize: 25,
        marginLeft:windowWidth/50,
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
    container:{
       justifyContent:"flex-start",
       marginTop:windowHeight/100
    }
});

export default StudioGhibliList;
