import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import crownIcon from '../assets/images/crown.png';

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
      { backgroundColor: '#F4B101', height: 155, top: 20, zIndex: 3, position: 'absolute' },
      { backgroundColor: '#C0C0C0', height: 135, top: 40, zIndex: 2, position: 'absolute', left: '5%' },
      { backgroundColor: '#CD7F32', height: 115, top: 60, zIndex: 1, position: 'absolute', right: '5%' },
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
        <Text style={styles.podiumName}>{item.id}</Text>
        <Text style={styles.podiumCoins}>{item.coins} Coins</Text>
      </View>
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.userContainer}>
      <Text style={styles.rank}>{index + 4}</Text> {/* Starting from 4th place */}
      <Image
        source={{ uri: placeholderAvatar(item.id) }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{item.id}</Text>
      <Text style={styles.coins}>{item.coins} Coins</Text>
    </View>
  );

  const placeholderAvatar = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=619E7B&color=fff&size=60`;

  return (
    <View style={styles.container}>
      <UserHeader />
      <Text style={styles.headerText}>Leaderboards</Text>

      {/* Podium for Top 3 Users */}
      <View style={styles.podiumWrapper}>
        {leaderboard.slice(0, 3).map((item, index) => renderPodium(item, index))}
      </View>

      {/* Display Remaining Users */}
      <FlatList
        data={leaderboard.slice(3)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  podiumWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 160,
    marginBottom: 60,
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
    top: -5,
  },
  podiumAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  podiumName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  podiumCoins: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    textAlign: 'center',
    marginBottom: 4,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  coins: {
    fontSize: 16,
    fontWeight: '500',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 12,
  },
});
