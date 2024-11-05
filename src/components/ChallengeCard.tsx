import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Modal,
} from 'react-native';

const backgroundImage = require('../assets/images/gradient_bg.png');

// Function to generate a random pastel color
const getRandomPastelColor = () => {
  const red = Math.floor(Math.random() * 127 + 128); // 128 to 255
  const green = Math.floor(Math.random() * 127 + 128); // 128 to 255
  const blue = Math.floor(Math.random() * 127 + 128); // 128 to 255
  return `rgb(${red}, ${green}, ${blue})`;
};

const ChallengeCard = ({challenge}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const headerColor = getRandomPastelColor();

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleConfirm = confirmed => {
    setModalVisible(false);
    // Handle the 'Yes' or 'No' action here
    if (confirmed) {
      console.log('Task completed!');
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
        <View style={[styles.header, {backgroundColor: headerColor}]} />

        <Text style={styles.challengeText}>{challenge || 'MEOW'}</Text>

        <TouchableOpacity style={styles.completeButton} onPress={handlePress}>
          <Text style={styles.buttonText}>Complete</Text>
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
              Just checking in! Did you finish drinking your 8 glasses of water
              today?
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
    transform: [{translateX: -95}],
    width: 230,
  },
  buttonText: {
    color: '#689F38',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 17,
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
