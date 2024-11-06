import {StyleSheet, Text, View, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';

const coin = require('../assets/images/coin.png');
const level = require('../assets/images/level_bg.png');

const UserHeader = () => {
  const currentUser = auth().currentUser;
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const subscriber = firestore()
      .collection('UserMain')
      .doc(currentUser.displayName)
      .onSnapshot(
        documentSnapshot => {
          if (documentSnapshot.exists) {
            setStats({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          } else {
            console.log('User does not exist!');
          }
          setLoading(false);
        },
        error => {
          console.error('Error fetching user data: ', error);
          setLoading(false);
        },
      );

    return () => subscriber();
  }, [currentUser?.uid]);

  const placeholderAvatar = name =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name,
    )}&background=619E7B&color=fff&size=60`;

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.profileSection}>
          <Image
            source={{uri: placeholderAvatar(currentUser?.displayName)}}
            style={styles.avatarImage}
          />
          <View style={styles.textContainer}>
            <Text
              style={
                styles.greeting
              }>{`Hi, ${currentUser?.displayName}.`}</Text>
            <Text style={styles.subtext}>Eco Starts Here!</Text>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statContainer}>
            <Image source={coin} style={styles.statIcon} />
            <Text style={styles.statValue}>{stats.coins}</Text>
          </View>

          <View style={styles.levelContainer}>
            <Text style={styles.levelValue}>{stats.level}</Text>
            <Image source={level} style={styles.levelIcon} />
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
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 40,
    backgroundColor: '#E5E5E5',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  textContainer: {
    gap: 0,
    marginLeft: 8,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Poppins-Medium',
  },
  subtext: {
    fontSize: 14,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
    zIndex: 1,
  },
});

export default UserHeader;
