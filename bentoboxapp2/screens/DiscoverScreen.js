import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import MainDisplay from '../Components/MainDisplay';
import SearchResults from '../Components/SearchResults';
import { Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const DiscoverScreen = () => {
    
    return (
        <View style={styles.container}>
            <SafeAreaView>
            <LinearGradient
                colors={['transparent', 'rgba(48, 119, 178, 0.5)', 'rgba(48, 119, 178, 1)']}
                style={{ width: windowWidth, height: windowHeight*0.60, transform: [{ translateY: windowHeight*0.35}]}}
                start={{ x: 0.5, y: 0.5}}
                end={{ x: 0.5, y: 1 }}
                position="absolute"
            />
            <ScrollView>
                <MainDisplay />
            </ScrollView>
            </SafeAreaView>
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
