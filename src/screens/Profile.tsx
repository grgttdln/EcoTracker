import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';

const backgroundImage = require('../assets/images/profile_bg.png');
//const leafIcon = require('../assets/images/leaf_icon.png'); // Use a placeholder if you don't have the exact icon
const fireIcon = require('../assets/images/fire.png');
const levelIcon = require('../assets/images/level_bg.png');
const coinIcon = require('../assets/images/coin.png');
const medalIcon = require('../assets/images/medal.png');

const Profile = ({navigation}: any) => {
  const [displayName, setDisplayName] = useState('');
  const [displayEmail, setDisplayEmail] = useState('');

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setDisplayName(user.displayName || 'User');
      setDisplayEmail(user.email || 'Email');
    }
  }, []);

  const signOutClick = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
    navigation.navigate('Welcome');
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarCircle}>
            {/* <Image source={leafIcon} style={styles.avatarIcon} /> */}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{displayEmail}</Text>
          </View>
        </View>

        {/* Stats Section */}
        <Text style={styles.statsTitle}>Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <View style={styles.statContent}>
              <Image source={fireIcon} style={styles.statIcon} />
              <View>
                <Text style={styles.statValue}>7</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>
          </View>
          <View style={styles.statBox}>
            <View style={styles.statContent}>
              <Image source={levelIcon} style={styles.statIcon} />
              <View>
                <Text style={styles.statValue}>1</Text>
                <Text style={styles.statLabel}>Level</Text>
              </View>
            </View>
          </View>

          <View style={styles.statBox}>
            <View style={styles.statContent}>
              <Image source={coinIcon} style={styles.statIcon} />
              <View>
                <Text style={styles.statValue}>324</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
            </View>
          </View>
          <View style={styles.statBox}>
            <View style={styles.statContent}>
              <Image source={medalIcon} style={styles.statIcon} />
              <View>
                <Text style={styles.statValue}>7</Text>
                <Text style={styles.statLabel}>Leaderboards</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={signOutClick}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Profile;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#12372A',
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#A9CBB7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    width: 40,
    height: 40,
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#12372A',
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#12372A',
  },
  statsTitle: {
    marginTop: 20,
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#12372A',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: {
    width: '48%',
    borderWidth: 3, // Defines the border thickness
    borderColor: '#E0E0E0', // Sets the border color
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },

  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#374B4A',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#374B4A',
  },
  logoutButton: {
    marginTop: 160,
    backgroundColor: '#79A065',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
});
