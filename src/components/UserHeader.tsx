import { StyleSheet, Text, View, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';

const coin = require('../assets/images/coin.png');
const level = require('../assets/images/level_bg.png');

const UserHeader = () => {
  const currentUser = auth().currentUser;
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    if (!currentUser) return; // Return if no user is logged in

    const subscriber = firestore()
      .collection('UserMain')
      .doc(currentUser.displayName) // Use uid to fetch the document
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          setStats({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        } else {
          console.log('User does not exist!');
        }
        console.log('User data: ', documentSnapshot.data());
        setLoading(false); // Set loading to false after fetching data
      }, error => {
        console.error("Error fetching user data: ", error);
        setLoading(false); // Handle loading state on error
      });

    return () => subscriber();
  }, [currentUser?.uid]); // Add currentUser.uid as a dependency

  if (loading) {
    return <Text>Loading...</Text>; // Add loading indicator
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.profileSection}>
          <View style={styles.avatarCircle} />
          <View style={styles.textContainer}>
            <Text style={styles.greeting}>{`Hi, ${currentUser?.displayName}`}</Text>
            <Text style={styles.subtext}>Keep pushing on!</Text>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statContainer}>
            <Image 
              source={coin} 
              style={styles.statIcon} 
            />
            <Text style={styles.statValue}>{stats.coins}</Text> {/* Use stats */}
          </View>

          <View style={styles.levelContainer}>
            <Text style={styles.levelValue}>{stats.level}</Text> {/* Use stats */}
            <Image 
              source={level} 
              style={styles.levelIcon} 
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    backgroundColor: '#E5E5E5',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  textContainer: {
    gap: 0,  
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  subtext: {
    fontSize: 16,
    color: '#79A065',
    fontFamily: 'Poppins-Regular',
  },
  statsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statContainer: {
    alignItems: 'center',
  },
  statIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFCA00',
    fontFamily: 'Poppins-Medium',
  },
  levelContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  levelIcon: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
    position: 'absolute',
  },
  levelValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
    zIndex: 1,
  },
});

export default UserHeader;
