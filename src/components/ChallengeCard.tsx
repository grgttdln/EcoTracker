import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';

// Import the local image
const backgroundImage = require('../assets/images/gradient_bg.png');

// Function to generate a random pastel color
const getRandomPastelColor = () => {
    const red = Math.floor(Math.random() * 127 + 128); // 128 to 255
    const green = Math.floor(Math.random() * 127 + 128); // 128 to 255
    const blue = Math.floor(Math.random() * 127 + 128); // 128 to 255
    return `rgb(${red}, ${green}, ${blue})`;
  };  

const ChallengeCard = ({ challenge }) => {
  const headerColor = getRandomPastelColor(); 

  return (
    <View style={styles.wrapper}>
      <ImageBackground 
        source={backgroundImage} 
        style={styles.container} 
        imageStyle={styles.imageStyle} 
      >
        <View style={[styles.header, { backgroundColor: headerColor }]} />
        
        <Text style={styles.challengeText}>
          {challenge || 'MEOW'}
        </Text>
        
        <TouchableOpacity style={styles.completeButton}>
          <Text style={styles.buttonText}>Complete</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
  },
  container: {
    width: 250,
    height: 220,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'flex-start', 
    overflow: 'hidden',
    position: 'relative',
  },
  imageStyle: {
    borderRadius: 20, 
  },
  header: {
    height: '50%', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0, 
    position: 'absolute', 
    top: 0,
    left: 0, 
    right: 0,
  },
  challengeText: {
    color: '#FFFFFF',
    fontSize: 20, 
    fontWeight: '600', 
    marginTop: 80, 
  },
  completeButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: [{ translateX: -95 }], 
    width: 230,
  },
  buttonText: {
    color: '#689F38',
    fontSize: 18, 
    fontWeight: '600',
  },
});

export default ChallengeCard;
