import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const backgroundImage = require('../assets/images/profile_bg.png');
const fireIcon = require('../assets/images/fire.png');
const levelIcon = require('../assets/images/level_bg.png');
const coinIcon = require('../assets/images/coin.png');
const medalIcon = require('../assets/images/medal.png');

const Profile = ({ navigation }) => {
  const currentUser = auth().currentUser;
  const [displayName, setDisplayName] = useState('');
  const [displayEmail, setDisplayEmail] = useState('');
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [coins, setCoins] = useState(0);
  const [rank, setRank] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        setDisplayName(currentUser.displayName || 'User');
        setDisplayEmail(currentUser.email || 'Email');

        const userRef = firestore().collection('UserMain').doc(currentUser.displayName);
        const unsubscribe = userRef.onSnapshot(async (documentSnapshot) => {
          if (documentSnapshot.exists) {
            const userData = documentSnapshot.data();
            setStreak(userData.streak || 0);
            setCoins(userData.coins || 0);

            // Calculate level based on coins (1 level per 100 coins)
            const calculatedLevel = Math.min(Math.floor((userData.coins || 0) / 100) + 1, 99);
            setLevel(calculatedLevel);

            // Update Firestore if level has changed and is within the cap
            if (calculatedLevel !== userData.level) {
              await userRef.update({ level: calculatedLevel });
            }
          }
        });

        return () => unsubscribe();
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const usersSnapshot = await firestore().collection('UserMain').get();
        const usersData = usersSnapshot.docs.map((doc) => ({
          ...doc.data(),
          displayName: doc.id,
        }));

        const sortedUsers = usersData.sort((a, b) => b.coins - a.coins);
        setLeaderboard(sortedUsers);

        const userRank = sortedUsers.findIndex(
          (u) => u.displayName === currentUser.displayName
        ) + 1;
        setRank(userRank > 0 ? userRank : 'N/A');
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchUserData();
    fetchLeaderboard();
  }, []);

  const signOutClick = () => {
    auth().signOut().then(() => console.log('User signed out!'));
    navigation.navigate('Welcome');
  };

  const placeholderAvatar = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=619E7B&color=fff&size=200`;

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Profile</Text>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarCircle}>
              <Image
                source={{ uri: placeholderAvatar(currentUser?.displayName) }}
                style={styles.avatarIcon}
              />
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
                  <Text style={styles.statValue}>{streak}</Text>
                  <Text style={styles.statLabel}>Day Streak</Text>
                </View>
              </View>
            </View>
            <View style={styles.statBox}>
              <View style={styles.statContent}>
                <Image source={levelIcon} style={styles.statIcon} />
                <View>
                  <Text style={styles.statValue}>{level}</Text>
                  <Text style={styles.statLabel}>Level</Text>
                </View>
              </View>
            </View>

            <View style={styles.statBox}>
              <View style={styles.statContent}>
                <Image source={coinIcon} style={styles.statIcon} />
                <View>
                  <Text style={styles.statValue}>{coins}</Text>
                  <Text style={styles.statLabel}>Points</Text>
                </View>
              </View>
            </View>
            <View style={styles.statBox}>
              <View style={styles.statContent}>
                <Image source={medalIcon} style={styles.statIcon} />
                <View>
                  <Text style={styles.statValue}>{rank ? `${rank}` : 'N/A'}</Text>
                  <Text style={styles.statLabel}>Ranking</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.statsTitle}>Achievements</Text>
          <Text>More achievements will be added soon!</Text>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={signOutClick}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Profile;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  container: {
    flex: 1,
    paddingBottom: 20,
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
    width: 78,
    height: 78,
    borderRadius: 40,
    backgroundColor: '#E5E5E5',
    borderWidth: 1,
    borderColor: '#EAEAEA',
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
    borderWidth: 3,
    borderColor: '#E0E0E0',
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
    marginTop: 20,
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
