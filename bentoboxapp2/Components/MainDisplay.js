import React, { PureComponent } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import TopAnimeBox from '../Components/TopAnimeBox';
import CurrentSeason from '../Components/CurrentSeason';
import UpcomingAnime from './UpcomingAnime';
import LoadingScreen from '../screens/LoadingScreen';

class MainDisplay extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ninetiesAnime: [],
            loading: true // Initially set loading to true
        };
    }

    componentDidMount() {
        // Call functions to fetch data
        this.getGhibliAnime();
        this.getNineties();
    }

    getGhibliAnime = async () => {
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime?producers=21`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const temp = await response.json();
            if (temp && temp.data) {
                // Update state with fetched data and set loading to false
                this.setState({ ghibliAnime: temp.data.slice(0, 25), loading: false });
            } else {
                console.error('Data structure is not as expected:', data);
            }
        } catch (error) {
            console.error('Error fetching ghibli anime:', error);
        }
    }

    getNineties = async () => {
        try {
            const response = await fetch("https://api.jikan.moe/v4/anime?type=tv&start_date=1989-01-01&end_date=1999-12-31&order_by=popularity&sort=asc");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const temp = await response.json();
            if (temp && temp.data) {
                // Update state with fetched data and set loading to false
                this.setState({ ninetiesAnime: temp.data.slice(0, 25), loading: false });
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
            // Show loading indicator while data is loading
            return (
                <LoadingScreen/>
            );
        } else {
            // Show content when data is loaded
            return (
                <View>
                    <TopAnimeBox />
                    <CurrentSeason />
                    <UpcomingAnime />
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
    }
});

export default MainDisplay;
