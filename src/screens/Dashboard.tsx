import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import auth from '@react-native-firebase/auth';
import ChallengeCard from '../components/ChallengeCard';
import firestore from '@react-native-firebase/firestore';

const Dashboard = () => {
  const currentUser = auth().currentUser;
  const [challenges, setChallenges] = useState({});

  // Function to shuffle an array
  const shuffleArray = (array) => {
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
            console.log("Existing Challenges:", taskData.challenges);
            setChallenges(taskData.challenges); 
          } else {
            const documentSnapshot = await firestore().collection('UserChallenges').doc("challenges").get();
            const challengesData = documentSnapshot.data();
            console.log("Fetched Challenges Data:", challengesData);
            
            const shuffledChallenges = shuffleArray(challengesData.challenge).slice(0, 5);

            const challengesDict = shuffledChallenges.reduce((acc, challenge) => {
              acc[challenge] = false; 
              return acc;
            }, {});

            setChallenges(challengesDict); 

            // Add to Firebase without replacing the existing document
            await firestore()
              .collection('UserMain')
              .doc(currentUser.displayName)
              .set({
                challenges: {
                  ...taskData?.challenges, 
                  ...challengesDict 
                },
                lastUpdated: today // Update the lastUpdated field
              }, { merge: true }); 

            console.log("Challenges added successfully!");
          }
        } catch (error) {
          console.error("Error fetching challenges: ", error);
        }
      } else {
        console.log("No user is currently logged in.");
      }
    };

    fetchChallenges();
  }, [currentUser]);

  return (
    <View style={styles.container}>
      <UserHeader />
      <Text>Dashboard</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContainer}
      >
        {Object.keys(challenges).length > 0 ? (
          Object.keys(challenges).map((challenge, index) => (
            <ChallengeCard key={index} challenge={challenge} /> 
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
  scrollContainer: {
    paddingHorizontal: 10,
  },
});
