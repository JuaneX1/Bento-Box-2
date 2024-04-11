import * as React from 'react';
import { StyleSheet, Text, View, Image, Pressable, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import Login from './Login';
import SignUp from './SignUp';
import LoginSwitch from '../Components/LoginSwitch';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function StartScreen() {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <View style={styles.container}>
      <Image 
        style={styles.image}
        source={require('../assets/BB Logo Icon_COLOR.png')}
      />
      <LoginSwitch
        selectedTab={selectedTab} 
        onTabChange={handleTabChange}
      />

      {selectedTab === 0 ? <Login /> : <SignUp />}

      <Pressable onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </Pressable>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111920',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 105,
    transform: [{ scale: 0.80 }],
    marginTop: windowHeight / 15,
  },
  forgotPassword: {
    color: '#fff',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});
