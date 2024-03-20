import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import MainDisplay from '../Components/MainDisplay';
import SearchResults from '../Components/SearchResults';
import { Dimensions } from 'react-native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SearchScreen = () => {
    const [searchedItem, setSearchedItem] = useState('');
    const [searchList, setSearchList] = useState([]);

    const handleInputFromSearch = (data) => {
        setSearchedItem(data);
    };

    const getSearched = async (searchedItem) => {
        try {
            if(searchedItem !== ''){
                const search = 'https://api.jikan.moe/v4/anime?sfw&order_by=popularity&sort=desc&q='+searchedItem;
                console.log(search);
                const response = await fetch(search);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const temp = await response.json();
                if (temp && temp.data) {
                    setSearchList(temp.data.slice(0, 25));
                } else {
                    console.error('Data structure is not as expected:', data);
                }
            }
            
        } catch (error) {
            console.error('Error fetching search anime:', error);
        }
    };

    useEffect(() => {
        getSearched(searchedItem);
    }, [searchedItem]);

    console.log('Searched item:', searchedItem);
    console.log(searchList.length);

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

export default SearchScreen;
