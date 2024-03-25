import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from 'react';
import { useState } from "react";
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LoginSwitch = ({selectedTab, onTabChange}) => {
    
    return(
            <View style={styles.switchBox}>
                <TouchableOpacity
                style={[styles.loginClick,
                {backgroundColor: selectedTab == 0 ? '#3077b2' : '#111920'
            }
                ]}
                onPress={()=>{
                    onTabChange(0);
                }}
                >
                    <Text
                    style={[
                        styles.loginText,
                        {backgroundColor: selectedTab == 0 ? '#3077b2' : '#111920',
                        color: selectedTab == 0 ? '#111920': '#fff',}
                    ]}
                    >Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[styles.signUpClick,
                    
                    {backgroundColor: selectedTab == 1 ? '#3077b2' : '#111920'
                }
                ]}
                onPress={()=>{
                    onTabChange(1);
                }}
                >
                    <Text
                    style={[
                        styles.signUpText,
                        {backgroundColor: selectedTab == 1 ? '#3077b2': '#111920',
                        color: selectedTab == 1 ? '#111920': '#fff',
                    }
                    ]}
                    >Sign Up</Text>
                </TouchableOpacity>
            </View>
    )
}

const styles = StyleSheet.create({
    switchBox:{
        width: "80%",
        height: 45,
        borderWidth:2,
        borderRadius:15,
        marginTop: windowHeight/40,
        flexDirection:'row',
        alignItems:'center',
        borderColor:"#fff"
    },
    loginText:{
        fontSize: 15,
        fontWeight: '700'
    },
    signUpText:{
        fontSize: 15,
        fontWeight: '700'
    },
    loginClick: {
        width: "50%",
        height:40,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    signUpClick: {
        width: "50%",
        height:40,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default LoginSwitch