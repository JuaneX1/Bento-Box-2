import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, ScrollView, TouchableOpacity, Dimensions, SafeAreaView} from 'react-native';
import SearchResults from '../Components/SearchResults';
import { AntDesign } from '@expo/vector-icons';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { debounce} from '../functions/function'; // Import the debounce function

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SearchScreen = () => {
    const [searchedItem, setSearchedItem] = useState('');
    const [searchList, setSearchList] = useState([]);
    const navigation = useNavigation()

    const getSearched = async (searchedItem) => {
        try {
            if (searchedItem !== '') {
                const search = 'https://api.jikan.moe/v4/anime?order_by=popularity&genres_exclude=9,49,12&q=' + searchedItem;
                console.log(search);
                const response = await fetch(search);
                if (response.status === 429) {
                    throw new Error('Too Many Request');
                }
                const temp = await response.json();
                if (temp && temp.data) {
                    const filteredData = temp.data.filter(anime => {
                        return anime.type === 'TV'&& anime.source==='Manga' || anime.type === 'Movie'&& anime.source==='Manga';
                    });
                    setSearchList(filteredData.slice(0, 25));
                } else {
                    console.error('Data structure is not as expected:', temp);
                }
            }
        } catch (error) {
            console.error('Error fetching search anime:', error);
        }
    };

    const debouncedGetSearched = debounce(getSearched, 1000); // Debounce getSearched function

    useEffect(() => {
        debouncedGetSearched(searchedItem); // Call debounced function
    }, [searchedItem]);

    console.log('Searched item:', searchedItem);
    console.log(searchList.length);

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity 
                    onPress={() => 
                        navigation.goBack()}
                    style={styles.searchButton}>
                        <Ionicons name="arrow-back" size={32} color="white" />
                </TouchableOpacity>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Search Here....*"
                    onChangeText={setSearchedItem}
                />
               
            </View>
            
                <SearchResults searchList={searchList} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#111920',
        alignItems:'flex-start',
        justifyContent:'flex-start',
        padding:10
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
    },
    input: {
        height: "60%",
        margin: 12,
        borderWidth: 2,
        width: "95%",
        padding: 10,
        borderRadius: 15,
        color:"#ffffff",
        backgroundColor:"#000000",
        borderColor:'#3077b2'
      },
    searchButton: {
        backgroundColor: '#3077b2',
        width: 35,
        height: 35,
        borderRadius: 17.5,
        marginLeft:20
        
    }
});

export default SearchScreen;
