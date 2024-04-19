import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AxiosRateLimit from 'axios-rate-limit';

// Create an instance of axios
const axiosInstance = axios.create();

// Apply rate limiting to the axios instance
const axiosWithRateLimit = AxiosRateLimit(axiosInstance, { maxRequests: 1, perMilliseconds: 1000 }); // Example: 1 request per 1 seconds

// Function to fetch top anime with caching and expiration
export const fetchTopAnime = async () => {
    try {
        const cachedData = await AsyncStorage.getItem('topAnime');
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            // Check if cached data has expired (e.g., cache duration is 1 hour)
            if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                return data;
            }
        }
        console.log("api request!");
      
        // Fetch fresh data from the API
        const response = await axiosWithRateLimit.get('https://api.jikan.moe/v4/top/anime', {
            params: {
                sfw: true,
                filter: 'bypopularity'
            }
        });
        const data = response.data;
        if (data && data.data) {
            // Cache the fetched data with current timestamp
            const timestamp = Date.now();
            await AsyncStorage.setItem('topAnime', JSON.stringify({ data: data.data.slice(0, 25), timestamp }));
            return data.data.slice(0, 25);
        } else {
            console.error('Data structure is not as expected:', data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching top anime:', error);
        return [];
    }
};
