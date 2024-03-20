import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { doLogin } from '../api/doLogin';

export default function Login() {
    const navigation = useNavigation();

    const [signIn, setSignIn] = useState({
        email: '',
        password: ''
    });

    const handleClick = async () => {
        await doLogin(signIn, navigation);
    };

    const handleChange = (name, value) => {
        setSignIn({ ...signIn, [name]: value });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Login: </Text>
            <TextInput
                style={styles.input}
                placeholder="Username*"
                value={signIn.email}
                onChangeText={text => handleChange('email', text)}
            />
            <Text style={styles.text}>Password: </Text>
            <TextInput
                style={styles.input}
                placeholder="Password*"
                secureTextEntry={true}
                value={signIn.password}
                onChangeText={text => handleChange('password', text)}
            />
            <Pressable
                style={styles.submitButton}
                onPress={handleClick}
            >
                <Text style={styles.text}>Login</Text>
            </Pressable>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        backgroundColor: '#111920',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 2,
        width: 200,
        padding: 10,
        borderRadius: 15,
        backgroundColor: "#ffffff",
        borderColor: '#3077b2'
    },
    submitButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 25,
        elevation: 3,
        backgroundColor: '#3077b2',
    },
    text: {
        color: 'white'
    }
});
