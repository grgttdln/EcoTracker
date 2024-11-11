import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import generateCertificate from '../components/generateCertificate';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const crownIcon = require('../assets/images/crown.png');
const level = require('../assets/images/level_bg.png');
const medalIcon = require('../assets/images/medal_podium.png');

const Leaderboards = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const currentUser = auth().currentUser;
  const [displayName, setDisplayName] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [currentUserRank, setCurrentUserRank] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (currentUser) {
        setDisplayName(currentUser.displayName || 'User');
        try {
          const usersSnapshot = await firestore().collection('UserMain').get();
          const usersData = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          const sortedData = usersData.sort((a, b) => b.coins - a.coins);
          setLeaderboard(sortedData);

          const userRank = sortedData.findIndex(user => user.id === currentUser.displayName);
          setCurrentUserRank(userRank < 3 ? userRank : null);
        } catch (error) {
          console.error('Error fetching leaderboard data: ', error);
        }
      }
    };

    fetchLeaderboard();
  }, [currentUser]);

  const handlePodiumPress = (rank) => {
    if (currentUserRank === rank && !hasClicked) {
      setModalVisible(true);
      setHasClicked(true);
    }
  };

  const closeModal = () => setModalVisible(false);

const renderPodium = (item, index) => {
    const podiumStyles = [
      {
        backgroundColor: '#FFC453',
        height: 220,
        top: 20,
        zIndex: 3,
        position: 'absolute',
      },
      {
        backgroundColor: '#D6D6D6',
        height: 200,
        top: 40,
        zIndex: 2,
        position: 'absolute',
        left: '5%',
      },
      {
        backgroundColor: '#E69B4B',
        height: 180,
        top: 60,
        zIndex: 1,
        position: 'absolute',
        right: '5%',
      },
    ];

  const isCurrentUser = item.id === currentUser.displayName;
  const isTopUser = currentUserRank === index;

  return (
    <TouchableOpacity
      style={[styles.podiumContainer, podiumStyles[index]]}
      onPress={() => handlePodiumPress(index)}
      activeOpacity={isTopUser ? 0.7 : 1}
    >
      {index === 0 && <Image source={crownIcon} style={styles.crownImage} />}
      <Image source={{ uri: placeholderAvatar(item.id) }} style={styles.podiumAvatar} />
      <View style={styles.levelIconContainer}>
        <Image source={level} style={styles.levelIconPodium} />
        <Text style={styles.levelText}>{item.level}</Text>
      </View>
      <Text style={styles.podiumName}>{item.id}</Text>
      <View style={styles.coinsBox}>
        <Image source={medalIcon} style={styles.medalIconPodium} />
        <Text style={styles.podiumCoins}>{item.coins}</Text>
      </View>
      {isTopUser && !hasClicked && <View style={styles.redDot} />}
    </TouchableOpacity>
  );
};



  const renderItem = ({item, index}) => {
    const isLastItem = index === leaderboard.length - 1 - 3;

    return (
      <View style={[styles.userContainer, isLastItem && styles.lastItem]}>
        <View style={styles.infoContainer}>
          <Text style={styles.rank}>{index + 4}</Text>
          <View>
            <Text style={styles.name}>{item.id}</Text>
            <Text style={styles.coins}>{item.coins} Coins</Text>
          </View>
        </View>
        <Image
          source={{uri: placeholderAvatar(item.id)}}
          style={styles.avatar}
        />
      </View>
    );
  };

  const placeholderAvatar = name =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name,
    )}&background=619E7B&color=fff&size=60`;

  const downloadCertificate = () => {
    generateCertificate(displayName);
  };

  return (
    <>
      <UserHeader />
      <View style={styles.container}>
        <Text style={styles.headerText}>Weekly Leaderboards</Text>
        <View style={styles.podiumWrapper}>
          {leaderboard.slice(0, 3).map((item, index) => renderPodium(item, index))}
        </View>
        <FlatList
          data={leaderboard.slice(3)}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
<Modal visible={isModalVisible} transparent animationType="slide">
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      {/* X button for closing the modal */}
      <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
        <Text style={styles.closeIconText}>✕</Text>
      </TouchableOpacity>

      <Text style={styles.modalTitle}>
        Congratulations, {displayName}!
      </Text>
      <Text style={styles.modalText}>
        You are one of the top sustainable people this week!
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.dlButton} onPress={downloadCertificate}>
          <Text style={styles.dlButtonText}>Download Certificate</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

      </View>
    </>
  );
};

export default Leaderboards;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    marginBottom: 10,
  },
  podiumWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 180,
    marginBottom: 80,
  },
  podiumContainer: {
    width: 125,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    marginHorizontal: -1,
    justifyContent: 'flex-end',
  },
  crownImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    position: 'absolute',
    top: 0,
  },
  podiumAvatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginBottom: 10,
  },
  podiumName: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  podiumCoins: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FEA800',
    textAlign: 'center',
    lineHeight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    marginVertical: 2,
    fontFamily: 'Poppins-Medium',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderColor: '#EAECF0',
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rank: {
    fontSize: 18,
    fontFamily: 'Poppins-Black',
    borderWidth: 2,
    borderColor: '#EAECF0',
    borderRadius: 20,
    textAlign: 'center',
    width: 40,
    height: 40,
    lineHeight: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
  },
  coins: {
    fontSize: 14,
    fontFamily: 'Poppins-Black',
    color: '#9B9BA1',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  coinsBox: {
    backgroundColor: '#FFF3DA',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    marginTop: 4,
  },
  medalIconPodium: {
    width: 20,
    height: 20,
    marginRight: 2,
  },
  levelIconContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  levelIconPodium: {
    width: 25,
    height: 25,
    marginBottom: 5,
  },
  levelText: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 3,
  },
   modalContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: 'rgba(0, 0, 0, 0.5)',
   },
   modalContent: {
     backgroundColor: '#fff',
     padding: 20,
     borderRadius: 10,
     alignItems: 'center',
     width: 320,
     height: 280,
     justifyContent: 'space-evenly',
   },
     modalTitle: {
       fontSize: 20,
       fontFamily: 'Poppins-SemiBold',
       color: '#334E2A',
       marginBottom: 5,
     },
   modalText: {
     fontSize: 18,
     fontFamily: 'Poppins-Medium',
     marginBottom: 20,
     textAlign: 'center',
   },
   buttonContainer: {
     flexDirection: 'column',
     justifyContent: 'center',  // Center the buttons vertically
     alignItems: 'center', // Center buttons horizontally
     width: '100%',  // Ensure buttons take up full width of the modal
     marginTop: 10, // Provide spacing from modal text
   },
   dlButton: {
     backgroundColor: '#689F38',
     borderRadius: 30,
     paddingVertical: 5,
     paddingHorizontal: 30,
     marginBottom: 10, // Provide spacing between buttons
     width: '80%', // Limit button width
     alignItems: 'center', // Center text inside the button
   },
   dlButtonText: {
     color: 'white',
     fontFamily: 'Poppins-SemiBold',
     fontSize: 17,
     textAlign: 'center', // Ensure text is centered within the button
   },
closeIcon: {
  position: 'absolute',
  top: 2,
  right: 10,
  padding: 10,
},
closeIconText: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#334E2A',
},

  redDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
    lastItem: {
      marginBottom: 100,
    },
});
