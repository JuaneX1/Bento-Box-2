import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export async function updateProfile(profileData) {
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

        // Make PATCH request to update profile endpoint
        const response = await instance.patch('/updateInfo', profileData);

        if (response.status === 200) {
            // Profile updated successfully
            return { success: true, error: '' };
        } else {
            // Error updating profile
            console.error('Error updating profile:', response);
            return { success: false, error: 'Error updating profile' };
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}
