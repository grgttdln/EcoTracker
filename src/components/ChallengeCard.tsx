import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Modal,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const backgroundImage = require('../assets/images/gradient_bg.png');

// Function to generate a random pastel color
const getRandomPastelColor = () => {
  const red = Math.floor(Math.random() * 127 + 128); // 128 to 255
  const green = Math.floor(Math.random() * 127 + 128); // 128 to 255
  const blue = Math.floor(Math.random() * 127 + 128); // 128 to 255
  return `rgb(${red}, ${green}, ${blue})`;
};

const ChallengeCard = ({ challenge, isCompleted: initialIsCompleted }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
  const headerColor = getRandomPastelColor();
  const [currCoins, setCurrCoins] = useState();

  const user = auth().currentUser;

  useEffect(() => {
    // Ensure the state updates if the initial prop changes
    setIsCompleted(initialIsCompleted);
  }, [initialIsCompleted]);

   
  useEffect(() => {
    const fetchCoins = () => {
      if (user) {
        try {
          // Set up the Firestore listener
          const unsubscribe = firestore()
            .collection('UserMain')
            .doc(user.displayName) // Use uid or displayName to fetch the document
            .onSnapshot(
              (documentSnapshot) => {
                if (documentSnapshot.exists) {
                  const userData = documentSnapshot.data();
                  const coins = userData.coins; // Access the coins field
  
                  setCurrCoins(coins); // Update the state with the coins value
                } else {
                  console.log('User does not exist!');
                }
              },
              (error) => {
                console.error('Error fetching coins: ', error);
              }
            );
  
          // Return the unsubscribe function to clean up the listener
          return () => unsubscribe();
        } catch (error) {
          console.error('Error setting up listener: ', error);
        }
      } else {
        console.log('No user is currently logged in.');
      }
    };

    console.log('Current Coins:', currCoins);
  
    // Call the fetchCoins function
    const unsubscribe = fetchCoins();
  
    // Clean up the listener on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currCoins]); // Add currentUser as a dependency
  



  const handlePress = () => {
    setModalVisible(true);
  };

  const handleConfirm = (confirmed) => {
    setModalVisible(false);
    if (confirmed) {
      console.log('Task completed!');
      setIsCompleted(true); // Mark the challenge as completed

     
      firestore()
        .collection('UserMain')
        .doc(user.displayName)
        .set(
          {
            challenges: {
              [challenge]: true, // Set the challenge as completed
            },
          },
          { merge: true }
        );

      // Update the coins in the database
      firestore()
      .collection('UserMain')
      .doc(user.displayName)
      .update({
        coins: parseInt(currCoins, 10) + 10, // Convert currCoins to an integer and add 10
      });
    
    } else {
      console.log('Task not completed.');
    }
  };

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={backgroundImage}
        style={styles.container}
        imageStyle={styles.imageStyle}>
        <View style={[styles.header, { backgroundColor: headerColor }]} />

        <Text style={styles.challengeText}>{challenge || 'MEOW'}</Text>

        {/* Disable the button when the challenge is completed */}
        <TouchableOpacity
          style={[
            styles.completeButton,
            isCompleted && styles.disabledButton, // Apply different style if completed
          ]}
          onPress={handlePress}
          disabled={isCompleted}>
          <Text
            style={[
              styles.buttonText,
              isCompleted && styles.disabledButtonText, // Change text color if completed
            ]}>
            {isCompleted ? 'Completed' : 'Complete'}
          </Text>
        </TouchableOpacity>
      </ImageBackground>

      {/* Modal for Task Confirmation */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Task Completion</Text>
            <Text style={styles.modalText}>
              Just checking in! {challenge} today?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.noButton}
                onPress={() => handleConfirm(false)}>
                <Text style={styles.noButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.yesButton}
                onPress={() => handleConfirm(true)}>
                <Text style={styles.yesButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
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
    fontFamily: 'Poppins-SemiBold',
    fontSize: 17,
  },
  disabledButton: {
    backgroundColor: '#D3D3D3', // Light grey color for disabled state
  },
  disabledButtonText: {
    color: '#A9A9A9', // Dark grey color for text in disabled state
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#334E2A',
    marginBottom: 25,
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#334E2A',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  noButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#689F38',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 50,
    marginRight: 10,
  },
  noButtonText: {
    color: '#689F38',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
  },
  yesButton: {
    backgroundColor: '#689F38',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 50,
  },
  yesButtonText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
  },
});

export default ChallengeCard;
