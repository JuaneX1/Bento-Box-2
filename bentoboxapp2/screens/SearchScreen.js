import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import SearchResults from '../Components/SearchResults';

global.s =''
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SearchScreen = () => {
    const [searchedItem, setSearchedItem] = useState('');
    const [searchList, setSearchList] = useState([]);

    const getSearched = async (searchedItem) => {
        try {
            if (searchedItem !== '') {
                const search = 'https://api.jikan.moe/v4/anime?sfw&order_by=popularity&q=' + searchedItem;
                console.log(search);
                const response = await fetch(search);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const temp = await response.json();
                if (temp && temp.data) {
                    setSearchList(temp.data.slice(0, 25));

                } else {
                    console.error('Data structure is not as expected:', temp);
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
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Search Here....*"
                    onChangeText={setSearchedItem}
                />
                <TouchableOpacity 
                    onPress={() => 
                        getSearched(searchedItem)}
                    style={styles.searchButton}>
                </TouchableOpacity>
            </View>
            
                <SearchResults searchList={searchList} />
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
    },
    searchBarContainer: {
        width: '75%',
        backgroundColor: '#111920',
        alignSelf: 'baseline',
        borderBlockColor: '#111920',
    },
    searchBarInputContainer: {
        borderColor: '#111920',
        height: 35,
    },
    input: {
        height: "60%",
        margin: 12,
        borderWidth: 2,
        width: "75%",
        padding: 10,
        borderRadius: 15,
        color:"#ffffff",
        backgroundColor:"#000000",
        borderColor:'#3077b2'
      },
    searchButton: {
        backgroundColor: '#ef4136',
        width: 60,
        height: 30,
        borderRadius: 7,
        alignSelf: 'center',
    }
});

export default SearchScreen;
