import { StyleSheet, Text, View, FlatList, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import crownIcon from '../assets/images/crown.png';

const level = require('../assets/images/level_bg.png');
const medalIcon = require('../assets/images/medal_podium.png');

const Leaderboards = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const currentUser = auth().currentUser;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const usersSnapshot = await firestore().collection('UserMain').get();
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Sort users by coins in descending order
        const sortedData = usersData.sort((a, b) => b.coins - a.coins);
        setLeaderboard(sortedData);
      } catch (error) {
        console.error("Error fetching leaderboard data: ", error);
      }
    };

    fetchLeaderboard();
  }, []);

  const renderPodium = (item, index) => {
    const positions = [
      { backgroundColor: '#FFC453', height: 210, top: 20, zIndex: 3, position: 'absolute' },
      { backgroundColor: '#D6D6D6', height: 190, top: 40, zIndex: 2, position: 'absolute', left: '5%' },
      { backgroundColor: '#E69B4B', height: 170, top: 60, zIndex: 1, position: 'absolute', right: '5%' },
    ];
  
    return (
      <View style={[styles.podiumContainer, positions[index]]}>
        {index === 0 && (
          <Image source={crownIcon} style={styles.crownImage} />
        )}
        <Image
          source={{ uri: placeholderAvatar(item.id) }}
          style={styles.podiumAvatar}
        />
        <View style={styles.levelIconContainer}>
          <Image source={level} style={styles.levelIconPodium} />
          <Text style={styles.levelText}>{index + 1}</Text> {/* Add this text element */}
        </View>

        <Text style={styles.podiumName}>{item.id}</Text>
        <View style={styles.coinsBox}> 
          <Image source={medalIcon} style={styles.medalIconPodium} />
          <Text style={styles.podiumCoins}>{item.coins}</Text>
        </View>
      </View>
    );
  };
  

  const renderItem = ({ item, index }) => {
    const isLastItem = index === leaderboard.length - 1 - 3; // Check if it's the last item
  
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
          source={{ uri: placeholderAvatar(item.id) }}
          style={styles.avatar}
        />
      </View>
    );
  };
  
  

  const placeholderAvatar = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=619E7B&color=fff&size=60`;

  return (
    <>
    <UserHeader />
    <View style={styles.container}>
      <Text style={styles.headerText}>Leaderboards</Text>

      {/* Podium for Top 3 Users */}
      <View style={styles.podiumWrapper}>
        {leaderboard.slice(0, 3).map((item, index) => renderPodium(item, index))}
      </View>

      <ScrollView  
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContainer}
      >
      {/* Display Remaining Users */}
        <FlatList
          data={leaderboard.slice(3)}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </ScrollView>
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
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
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
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  podiumName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "#FFFFFF",
    marginBottom: 4,
  },
  podiumCoins: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FEA800',
    textAlign: 'center',
    marginBottom: 4,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#EAECF0',
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
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
    fontWeight: '500',
  },
  coins: {
    fontSize: 14,
    fontWeight: '900',
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
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    flexDirection: 'row', 
    alignItems: 'center', 
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
  lastItem: {
    marginBottom: 100, // Adjust the margin as needed
  },
  
});
