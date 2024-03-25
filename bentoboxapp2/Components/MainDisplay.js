import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Image, Pressable, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import React, { PureComponent } from 'react';
import TopAnimeBox from '../Components/TopAnimeBox';
import CurrentSeason from '../Components/CurrentSeason';
import UpcomingAnime from './UpcomingAnime';

class MainDisplay extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ninetiesAnime: [],
            loading: false
        };
    }

    componentDidMount() {
        var startTime = performance.now();
        var endTime = performance.now();
        console.log(`Call to fetch anime took ${endTime - startTime} milliseconds`);
    }


    getGhibliAnime = async () => {
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime?producers=21`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const temp = await response.json();
            if (temp && temp.data) {
                this.setState({ ghibliAnime: temp.data.slice(0, 25) });
            } else {
                console.error('Data structure is not as expected:', data);
            }
        } catch (error) {
            console.error('Error fetching ghibli anime:', error);
        }
        
    }

    getNineties = async ()=> {
        try {
            const response = await fetch("https://api.jikan.moe/v4/anime?type=tv&start_date=1989-01-01&end_date=1999-12-31&order_by=popularity&sort=asc");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const temp = await response.json();
            if (temp && temp.data) {
                this.setState({ ninetiesAnime: temp.data.slice(0, 25) });
            } else {
                console.error('Data structure is not as expected:', data);
            }
        } catch (error) {
            console.error('Error fetching top anime:', error);
        }
    }
    render() {
        const { loading } = this.state;

        if (loading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            );
        }
        else{
            this.setState({loading: false})
            return (
                <View >
                        <TopAnimeBox/>
                        <CurrentSeason/>
                        <UpcomingAnime/>
                </View>
            );
            
        }
        
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
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

export default MainDisplay;
