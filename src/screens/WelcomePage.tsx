import React from 'react';
import {
  Button,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

const backgroundImage = require('../assets/images/bg.png');

const WelcomePage = ({navigation}: any) => {
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.txtContainer}>
        <Text style={styles.title}>EcoTrack</Text>
        <Text style={styles.description}>
          Your Personal Guide to a Greener Future: Track, Reduce, and Transform
          Your Carbon Footprint with Ease
        </Text>
      </View>
      <TouchableOpacity
        style={styles.customBtn}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.btnText}>Continue</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 65,
  },
  txtContainer: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 40,
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginBottom: 6,
  },
  description: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'Poppins-Medium',
  },
  customBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    paddingVertical: 15,
    paddingHorizontal: 35,
    backgroundColor: '#79A065',
    borderRadius: 30,
    marginBottom: 20,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
  },
});

export default WelcomePage;
