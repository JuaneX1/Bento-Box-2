import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Function to fetch top anime with caching and expiration
export const fetchUpcoming = async () => {
    try {
        const cachedData = await AsyncStorage.getItem('upcomingAnime');
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            // Check if cached data has expired (e.g., cache duration is 1 hour)
            if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                return data;
            }
        }
        // Fetch fresh data from the API
        const response = await axios.get('https://api.jikan.moe/v4/top/anime?sfw&filter=upcoming');

        const data = response.data;
        if (data && data.data) {
            // Cache the fetched data with current timestamp
            const uniqueData = Array.from(new Set(data.data.map(anime => anime.mal_id)))
                .map(mal_id => data.data.find(anime => anime.mal_id === mal_id));

            const timestamp = Date.now();
            await AsyncStorage.setItem('upcomingAnime', JSON.stringify({ data: uniqueData.slice(0, 25), timestamp }));
            return uniqueData.slice(0, 25);
        } else {
            console.error('Data structure is not as expected:', data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching upcoming anime:', error);
        return [];
    }
};
