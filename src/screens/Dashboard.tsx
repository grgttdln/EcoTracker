import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import UserHeader from '../components/UserHeader';
import auth from '@react-native-firebase/auth'; 

const Dashboard = () => {
  const currentUser = auth().currentUser;

  return (
    <View>
      <UserHeader username={currentUser?.displayName} /> {/* Pass username if needed */}
      <Text>Dashboard</Text>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});
