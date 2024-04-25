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
        this.setState({loading: false});
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
        zIndex:1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default MainDisplay;
