import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ProgressBar from 'react-native-progress/Bar';
import {ProgressChart} from 'react-native-chart-kit';
import UserHeader from '../components/UserHeader';
import auth from '@react-native-firebase/auth';
import ChallengeCard from '../components/ChallengeCard';
import firestore from '@react-native-firebase/firestore';

const Dashboard = () => {
  const currentUser = auth().currentUser;
  const [challenges, setChallenges] = useState({});
  const [displayName, setDisplayName] = useState('');
  const [displayEmail, setDisplayEmail] = useState('');
  const [streak, setStreak] = useState(0);
  const fireIcon = require('../assets/images/fire.png');

  // Fetch Streak
  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setDisplayName(user.displayName || 'User');
      setDisplayEmail(user.email || 'Email');

      // Fetch user stats from Firestore
      const userRef = firestore()
        .collection('UserMain')
        .doc(currentUser.displayName);
      userRef.get().then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const userData = documentSnapshot.data();
          setStreak(userData.streak || 0);
        }
      });
    }
  }, []);

  // Function to shuffle an array
  const shuffleArray = array => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const fetchChallenges = async () => {
      if (currentUser) {
        try {
          const userTask = await firestore()
            .collection('UserMain')
            .doc(currentUser.displayName)
            .get();

          const taskData = userTask.data();

          const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
          const lastUpdated = taskData?.lastUpdated || null;

          // Check if challenges need to be renewed
          if (lastUpdated === today && taskData?.challenges) {
            console.log('Existing Challenges:', taskData.challenges);
            setChallenges(taskData.challenges);
          } else {
            const documentSnapshot = await firestore()
              .collection('UserChallenges')
              .doc('challenges')
              .get();
            const challengesData = documentSnapshot.data();
            console.log('Fetched Challenges Data:', challengesData);

            const shuffledChallenges = shuffleArray(
              challengesData.challenge,
            ).slice(0, 5);

            const challengesDict = shuffledChallenges.reduce(
              (acc, challenge) => {
                acc[challenge] = false;
                return acc;
              },
              {},
            );

            setChallenges(challengesDict);

            await firestore()
              .collection('UserMain')
              .doc(currentUser.displayName)
              .set(
                {
                  challenges: {
                    ...taskData?.challenges,
                    ...challengesDict,
                  },
                  lastUpdated: today, // Update the lastUpdated field
                },
                {merge: true},
              );

            console.log('Challenges added successfully!');
          }
        } catch (error) {
          console.error('Error fetching challenges: ', error);
        }
      } else {
        console.log('No user is currently logged in.');
      }
    };

    fetchChallenges();
  }, [currentUser]);

  return (
    <View style={styles.container}>
      <UserHeader />
      <View style={styles.paddedContainer}>
        {/* Daily CO2 Goal Card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.cardTitle}>Daily CO₂ Goal</Text>
            <Text style={styles.progressText}>60/100</Text>
          </View>
          <ProgressBar progress={0.6} width={325} color="#056B4B" />
        </View>

        {/* Streak and Challenges */}
        <View style={styles.streakChallengesContainer}>
          <View style={styles.streakBox}>
            <View style={styles.streakContent}>
              <Image source={fireIcon} style={styles.streakIcon} />
              <View>
                <Text style={styles.streakValue}> {streak} </Text>
                <Text style={styles.streakLabel}>Day Streak</Text>
              </View>
            </View>
          </View>

          <View style={styles.challengeCard}>
            <Text style={styles.challengeCount}>12</Text>
            <Text style={styles.challengeText}>Challenges Completed</Text>
            <Text style={styles.challengeSubText}>+3 This Week</Text>
          </View>
        </View>

        {/* Annual Footprint */}
        <View style={styles.annualFootprintCard}>
          <View style={styles.annualFootprintTextContainer}>
            <Text style={styles.annualFootprintText}>
              Your Annual Footprint
            </Text>
            <Text style={styles.footprintValue}>15.62 T</Text>
            <Text style={styles.offsetText}>Annual Offsets</Text>
            <Text style={styles.offsetValue}>5.12 T</Text>
          </View>

          <ProgressChart
            data={{data: [0.25, 0.75]}} // 75% for footprint, 25% for offset
            width={Dimensions.get('window').width * 0.3}
            height={120}
            strokeWidth={8}
            radius={32}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              color: (opacity = 1, index) => {
                return index === 0
                  ? `rgba(226, 56, 58, ${opacity})` // Outer color for offsets
                  : `rgba(35, 117, 86, ${opacity})`; // Inner color for footprint
              },
              labelColor: () => `#F47D63`, // color for offsets
            }}
            hideLegend={true}
            style={styles.chartStyle}
          />
        </View>
        <Text style={styles.challengesLabel}> Today's Challenges </Text>
      </View>

      {/* Challenges */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {Object.keys(challenges).length > 0 ? (
          Object.keys(challenges).map((challenge, index) => (
            <ChallengeCard
              key={index}
              challenge={challenge}
              isCompleted={challenges[challenge]}
            />
          ))
        ) : (
          <Text>No challenges available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  paddedContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#FFF',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    padding: 20,
    // borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#12372A',
  },
  progressText: {
    marginTop: 5,
    fontSize: 14,
    color: '#12372A',
  },
  streakChallengesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(123, 160, 101, 0.25)',
    borderColor: '#7BA065',
    borderWidth: 1,
    // borderRadius: 15,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  streakBox: {
    flex: 1, // Make this box take up less space
    maxWidth: '40%', // Limit the width
    backgroundColor: 'rgba(123, 160, 101, 0.90)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  streakValue: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
  },
  streakLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#FFF',
  },
  challengeCard: {
    flex: 2, // Make this box take up more space
    backgroundColor: 'rgba(123, 160, 101, 0.90)',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeCount: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
    marginBottom: -8,
  },
  challengeText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#FFF',
    marginBottom: -8,
  },
  challengeSubText: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#FFF',
    marginTop: 5,
  },
  annualFootprintCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 20,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  annualFootprintTextContainer: {
    flex: 1,
    alignItems: 'flex-start', // Aligns the text to the left
  },
  annualFootprintText: {
    fontSize: 16,
    color: '#12372A',
    fontWeight: 'bold',
  },
  footprintValue: {
    fontSize: 24,
    color: '#237556',
    fontWeight: 'bold',
  },
  offsetText: {
    fontSize: 16,
    color: '#12372A',
    marginTop: 5,
  },
  offsetValue: {
    fontSize: 24,
    color: '#E2383A',
    fontWeight: 'bold',
  },
  chartStyle: {
    alignSelf: 'flex-end', // Aligns the chart to the right
    marginLeft: 20,
  },
  challengesLabel: {
    fontSize: 18,
    color: '#056B4B',
    fontFamily: 'Poppins-Bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
});
