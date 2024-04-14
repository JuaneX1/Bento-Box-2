import React from 'react';
import { View, ActivityIndicator, StyleSheet,Dimensions,Image } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Loading = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" style={styles.indicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  indicator:{
    color:"#ffffff",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
