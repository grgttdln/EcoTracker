// src/screens/DashboardTabs.tsx
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import an icon library

// Import actual screens for the tabs
import DashboardScreen from './Dashboard';
import CarbonScreen from './Carbon';
import LeaderboardScreen from './Leaderboards';
import ProfileScreen from './Profile';

const Tab = createBottomTabNavigator();

function DashboardTabs() {
  return (
    <Tab.Navigator
      initialRouteName="DashboardTab"
      screenOptions={({route}) => ({
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarShowLabel: false,
        tabBarIcon: ({color}) => {
          let iconName: string;

          switch (route.name) {
            case 'DashboardTab':
              iconName = 'task';
              break;
            case 'CarbonTab':
              iconName = 'energy-savings-leaf';
              break;
            case 'LeaderboardsTab':
              iconName = 'leaderboard';
              break;
            case 'ProfileTab':
              iconName = 'person';
              break;
            default:
              iconName = 'home';
          }

          return <MaterialIcons name={iconName} size={42} color={color} />;
        },
        tabBarActiveTintColor: '#79A065', // Active tab color
        tabBarInactiveTintColor: 'gray', // Inactive tab color
        headerShown: false,
      })}>
      <Tab.Screen name="DashboardTab" component={DashboardScreen} />
      <Tab.Screen name="CarbonTab" component={CarbonScreen} />
      <Tab.Screen name="LeaderboardsTab" component={LeaderboardScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 80,
    backgroundColor: '#F7F7F7',
    position: 'absolute',
    bottom: 20,
    left: 22,
    right: 22,
    borderRadius: 35,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  tabBarItemStyle: {
    paddingVertical: 10,
    margin: 10,
    borderRadius: 40,
  },
});

export default DashboardTabs;
