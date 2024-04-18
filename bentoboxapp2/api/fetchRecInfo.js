import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Function to fetch top anime with caching and expiration
export const fetchRecInfo = async ( list ) => {
    try {
        console.log("sskfsdkfsd " + list);
        /*const cachedData = await AsyncStorage.getItem('recommendedList');
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            // Check if cached data has expired (e.g., cache duration is 1 day)
            if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                return data;
            }
        }*/

        // Fetch data for each item in the list asynchronously
        const fetchDataPromises = list.map(async (item) => {
            try {
                const response = await axios.get(`https://api.jikan.moe/v4/anime/${item.mal_id}`);
                const responseData = response.data;
                if (responseData && responseData.data) {
                    return responseData.data; // Return the fetched data
                } else {
                    console.error('Data structure is not as expected:', responseData);
                    return null; // Return null if data structure is unexpected
                }
            } catch (error) {
                console.error('Error fetching anime:', error);
                return null; // Return null if an error occurs
            }
        });

        // Wait for all fetch requests to complete
        const fetchedData = await Promise.all(fetchDataPromises);

        // Filter out null values and cache the fetched data with current timestamp
        const filteredData = fetchedData.filter((data) => data !== null);
        const timestamp = Date.now();
        await AsyncStorage.setItem('recommendedList', JSON.stringify({ data: filteredData.slice(0, 1), timestamp }));
        
        return filteredData.slice(0, 10);
    } catch (error) {
        console.error('Error fetching top anime:', error);
        return [];
    }
};
