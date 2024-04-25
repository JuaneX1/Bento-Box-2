import React, { useState, useEffect } from 'react';
import { Image,StyleSheet, ActivityIndicator,Text,TextInput, View, ScrollView, TouchableOpacity, Dimensions, SafeAreaView} from 'react-native';
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
import { FontAwesome5 } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SearchScreen = () => {
    const [searchedItem, setSearchedItem] = useState('');
    const [searchList, setSearchList] = useState([]);
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    // Create an instance of axios
    const getSearched = async (searchedItem) => {
        if (searchedItem !== '') {
            setIsLoading(true);  // Start loading
            try {
                const response = await fetch(`https://api.jikan.moe/v4/anime?order_by=popularity&genres_exclude=9,49,12&q=${searchedItem}`);
                if (response.status === 429) {
                    throw new Error('Too Many Requests');
                }
                const temp = await response.json();
                if (temp && temp.data) {
                    const filteredData = temp.data.filter(anime => anime.type === 'TV' && anime.source === 'Manga' || anime.type === 'Movie' && anime.source === 'Manga');
                    setSearchList(filteredData.slice(0, 25));
                }
            } catch (error) {
                console.error('Error fetching search anime:', error);
            } finally {
                setIsLoading(false);  // End loading
            }
        } else {
            setSearchList([]); // Clear search list if input is empty
            setIsLoading(false);  // Ensure loading is stopped if there's no query
        }
    };


    useEffect(() => {
        getSearched(searchedItem); // Call debounced function
    }, [searchedItem]);

    console.log('Searched item:', searchedItem);

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
                <View style={[tw`bg-black/50 rounded-lg px-2 py-2  flex-row focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50`, { width: windowWidth/1.1, margin:10, marginLeft:10 }]}>
                <MaterialCommunityIcons name="magnify" color={'white'} size={20} />
                    <TextInput
                        style={tw`text-white focus:text-black w-56 px-2`}
                        placeholder="Search Here...."
                        placeholderTextColor="#fff" 
                        onSubmitEditing={(event) => setSearchedItem(event.nativeEvent.text)}
                    />
                
                </View>
            </View>
            {isLoading ? (
                <ActivityIndicator size="large" color="#ffffff" />
            ) : searchList.length > 0 ? (
                <SearchResults searchList={searchList} />
            ) : searchedItem === '' ? (
                <View style={{flex:'wrap', alignContent:'center', justifyContent:'center'}}>
                    <Text style={tw`px-5 text-white text-xl text-center font-bold`}>Browse our app to find exactly what you need!</Text>
                    <Image 
                        style={{width:148, height:158, alignSelf:'center'}}
                        source={require('../assets/BB Logo Icon_COLOR.png')}
                    />
                </View>
            ) : (
                <View style={{padding: 20, flex:'wrap', alignContent:'center', justifyContent:'center'}}>
                    <Text style={tw`px-5 text-white text-xl text-center font-bold`}>Whoops! Looks like there's no results for "{searchedItem}"</Text>
                    <FontAwesome5 style={{alignSelf:'center', padding:20}} name="sad-cry" size={48} color="white" />
                </View>
            )}
            
        
        </SafeAreaView>
        );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#111920',
        
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
        backgroundColor:"#ffffff",
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
