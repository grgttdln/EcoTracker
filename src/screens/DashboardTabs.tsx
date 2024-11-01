// src/screens/DashboardTabs.tsx
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View} from 'react-native';

// Import actual screens for the tabs
import DashboardScreen from './Dashboard';
import CarbonScreen from './Carbon';
import LeaderboardScreen from './Leaderboards';
import ProfileScreen from './Profile';

const Tab = createBottomTabNavigator();

function DashboardTabs() {
  return (
    <Tab.Navigator
      initialRouteName="DashboardScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Carbon" component={CarbonScreen} />
      <Tab.Screen name="Leaderboards" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default DashboardTabs;
