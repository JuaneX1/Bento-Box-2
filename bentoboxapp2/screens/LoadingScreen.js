import React from 'react';
import { View, ActivityIndicator, StyleSheet,Dimensions,Image } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
       <Image 
        style={styles.image}
        source={require('../assets/BB Logo Icon_COLOR.png')}
      />
      <ActivityIndicator size="large" style={styles.indicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  indicator:{
    color:"#ffffff",
  },
    image: {
    width: 200,
    height: 205,
    transform: [{ scale: 0.80 }],
  },
  container: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    backgroundColor: 'rgba(0,0,0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
