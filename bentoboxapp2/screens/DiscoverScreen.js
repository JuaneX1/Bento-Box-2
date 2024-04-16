import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import MainDisplay from '../Components/MainDisplay';
import SearchResults from '../Components/SearchResults';
import { Dimensions } from 'react-native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const DiscoverScreen = () => {
    
    return (
        <View style={styles.container}>
            <ScrollView>
                <MainDisplay />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111920',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        backgroundColor: '#111920',
        height: 125,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default DiscoverScreen;
