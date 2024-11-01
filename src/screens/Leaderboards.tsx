import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import UserHeader from '../components/UserHeader';
import auth from '@react-native-firebase/auth';

const Leaderboards = () => {
  const currentUser = auth().currentUser;

  return (
    <View style={styles.container}>
      <UserHeader />
      <Text>Leaderboards</Text>
    </View>
  );
};

export default Leaderboards;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
