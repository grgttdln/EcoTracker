import React from 'react';
import {
  Button,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

const backgroundImage = require('../assets/images/levelUp.png');

const LevelUp = ({navigation, route}: any) => {
  const {level} = route.params;
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.centeredNumberContainer}>
        <Text style={styles.centeredNumber}>{level}</Text>
      </View>

      <View style={styles.txtContainer}>
        <Text style={styles.title}>Congrats!</Text>
        <Text style={styles.titleSmall}>You leveled up.</Text>
        <Text style={styles.description}>
          Keep going and earn more levels along the way.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.customBtn}
        onPress={() => navigation.navigate('Dashboard')}>
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
  centeredNumberContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -20}, {translateY: -160}],
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredNumber: {
    fontSize: 64,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },
  txtContainer: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  titleSmall: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    marginHorizontal: 50,
    marginBottom: 50,
  },
  customBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    paddingVertical: 15,
    paddingHorizontal: 35,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    marginBottom: 20,
  },
  btnText: {
    color: '#A0BF6B',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
  },
});

export default LevelUp;
