import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { fetchRecInfo } from './fetchRecInfo';
// Function to fetch top anime with caching and expiration
export const fetchRecommendations = async ({id}) => {
    try {
        const cachedData = await AsyncStorage.getItem('recommendedAnime');
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            // Check if cached data has expired (e.g., cache duration is 1 hour)
            if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                return data;
            }
        }
        // Fetch fresh data from the API
        const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}/recommendations`);
        const data = response.data;
        if (data && data.data) {
            // Cache the fetched data with current timestamp
            const timestamp = Date.now();
            await AsyncStorage.setItem('recommendedAnime', JSON.stringify({ data: data.data.slice(0, 10), timestamp }));
            return data.data.slice(0, 10);
        } else {
            console.error('Data structure is not as expected:', data);
            return [];
        }
    } catch (error) {
        //console.log("fr");
        console.error('Error fetching FR anime:', error);
        return [];
    }
};
