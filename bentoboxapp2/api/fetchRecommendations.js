import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { fetchRecInfo } from './fetchRecInfo';
import { useAuth } from '../Components/AuthContext';
// Function to fetch top anime with caching and expiration

export const fetchRecommendations = async ({id, uD}) => {

        try {
       /*const cachedData = await AsyncStorage.getItem(`recommendedAnimeItem_${uD}`);
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            // Check if cached data has expired (e.g., cache duration is 1 hour)
            if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                return data;
            }
        }*/
        // Fetch fresh data from the API
        console.log(id);

        const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}/recommendations`);

        console.log('response');
        const data = response.data;
        if (data && data.data) {
            const arr = data.data;
            //const arr2=JSON.parse(arr);
            const randomIndex = Math.floor(Math.random() * arr.length);
            console.log(randomIndex);
            const randomItem = arr[randomIndex];
            console.log(randomItem);
            // Cache the fetched data with current timestamp
            const r = await axios.get(`https://api.jikan.moe/v4/anime/${randomItem}`);
            const timestamp = Date.now();
            await AsyncStorage.setItem(`recommendedAnimeItem_${uD}`, JSON.stringify({ data: randomItem, timestamp }));
            return randomItem;//data.data.slice(0, 10);
        } else {
            console.error('Data structure is not as expected:', data);
            return null;
        }
    } catch (error) {
        //console.log("fr");
        console.error('Error fetching FR anime:', error);
        //return null;
    }
};
