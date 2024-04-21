import React, { useState, useEffect } from 'react';
import { StyleSheet, Text,TextInput, View, ScrollView, TouchableOpacity, Dimensions, SafeAreaView} from 'react-native';
import SearchResults from '../Components/SearchResults';
import { AntDesign } from '@expo/vector-icons';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { debounce} from '../functions/function'; // Import the debounce function
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AxiosRateLimit from 'axios-rate-limit';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SearchScreen = () => {
    const [searchedItem, setSearchedItem] = useState('');
    const [searchList, setSearchList] = useState([]);
    const navigation = useNavigation()

    // Create an instance of axios
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
        getSearched(searchedItem); // Call debounced function
    }, [searchedItem]);

    console.log('Searched item:', searchedItem);
    console.log(searchList.length);

    if(searchedItem === ''){
        return( 
            <SafeAreaView style={styles.container}>
            <LinearGradient
              colors={['transparent', 'rgba(48, 119, 178, 0.5)', 'rgba(48, 119, 178, 1)']}
              style={{ width: windowWidth, height: windowHeight*0.60, transform: [{ translateY: windowHeight*0.36}]}}
              start={{ x: 0.5, y: 0.5}}
              end={{ x: 0.5, y: 1 }}
              position="absolute"
          />
           <View style={tw`items-center justify-center`}>
                <View style={[tw`bg-white/50 rounded-lg px-2 py-2 items-flex-start flex-row focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50`, { width: windowWidth/1.1, margin:10, marginLeft:10 }]}>
                <MaterialCommunityIcons name="magnify" color={'white'} size={20} />
                    <TextInput
                        style={tw`text-white focus:text-black px-2`}
                        placeholder="Search Here....*"
                        onSubmitEditing={(event) => setSearchedItem(event.nativeEvent.text)}
                    />
                
                </View>
            </View>
        <Text>Can't find what you're looking for? Search!</Text>
        </SafeAreaView>
        )
       
    }
    return (
        <SafeAreaView style={styles.container}>
              <LinearGradient
                colors={['transparent', 'rgba(48, 119, 178, 0.5)', 'rgba(48, 119, 178, 1)']}
                style={{ width: windowWidth, height: windowHeight*0.60, transform: [{ translateY: windowHeight*0.36}]}}
                start={{ x: 0.5, y: 0.5}}
                end={{ x: 0.5, y: 1 }}
                position="absolute"
            />
             <View style={tw`items-center justify-center`}>
                <View style={[tw`bg-white/50 rounded-lg px-2 py-2 items-flex-start flex-row focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50`, { width: windowWidth/1.1, margin:10, marginLeft:10 }]}>
                <MaterialCommunityIcons name="magnify" color={'white'} size={20} />
                    <TextInput
                        style={tw`text-white focus:text-black px-2`}
                        placeholder="Search Here....*"
                        onSubmitEditing={(event) => setSearchedItem(event.nativeEvent.text)}
                       
                    />
                
                </View>
            </View>
                <SearchResults searchList={searchList} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#111920',
        alignItems:'center',
        
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
