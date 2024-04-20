import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
export async function changePassword(email, password, newPassword, token) {
    try {
        const instance = axios.create({
            baseURL: 'https://bento-box-2-df32a7e90651.herokuapp.com/api',
            headers: {
                Authorization: `${token}`
            }
        });

        // Ensure the token is properly substituted into the URL
        const response = await instance.post(`/resetPassword/${token}`, { email, password, newPassword });

        if (response.status === 200) {
            // Password changed successfully
            return { success: true, error: '' };
        } else {
            // Error changing password
            console.error('Error changing password:', response);
            return { success: false, error: 'Error changing password' };
        }
    } catch (error) {
        console.error('Error changing password:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}