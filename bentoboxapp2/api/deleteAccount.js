import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export async function deleteAccount() {
    try {
        // Retrieve token from AsyncStorage
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            // Token not found, handle the error
            return { success: false, error: 'Token not found' };
        }

        // Create axios instance with token in the header
        const instance = axios.create({
            baseURL: 'https://bento-box-2-df32a7e90651.herokuapp.com/api',
            headers: {
                Authorization: `${token}`
            }
        });

        // Make DELETE request to delete account endpoint
        const response = await instance.delete('/deleteUser');

        if (response.status === 200) {
            // Account deleted successfully
            await AsyncStorage.removeItem('token');
            return { success: true, error: '' };
        } else {
            // Error deleting account
            console.error('Error deleting account:', response);
            return { success: false, error: 'Error deleting account' };
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}
