import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
  Linking,
} from 'react-native';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import AppUsage from 'react-native-app-usage';
import NetInfo from '@react-native-community/netinfo';
import {NativeModules} from 'react-native';

const {DataUsageModule} = NativeModules;

interface AppUsageData {
  packageName: string;
  totalTimeInForeground: number;
  lastVisibleTime: number;
  totalForegroundTime: number;
  totalVisibleTime: number;
}

type SectionProps = PropsWithChildren<{
  title: string;
}>;

export default function Carbon(): React.JSX.Element {
  const getAppCategory = (appName: string): string => {
    const lowerCaseName = appName.toLowerCase();

    // Social Media apps
    if (
      [
        'facebook',
        'instagram',
        'twitter',
        'tiktok',
        'linkedin',
        'pinterest',
        'snapchat',
        'reddit',
        'messenger',
      ].includes(lowerCaseName)
    ) {
      return 'Social Media';
    }

    // Productivity apps
    if (
      [
        'docs',
        'sheets',
        'drive',
        'outlook',
        'calendar',
        'notion',
        'evernote',
        'slack',
        'teams',
        'ecotrack',
      ].includes(lowerCaseName)
    ) {
      return 'Productivity';
    }

    // Entertainment apps
    if (
      [
        'youtube',
        'netflix',
        'spotify',
        'prime',
        'hulu',
        'disney',
        'twitch',
        'vimeo',
      ].includes(lowerCaseName)
    ) {
      return 'Entertainment';
    }

    // Messaging apps
    if (
      [
        'whatsapp',
        'telegram',
        'messenger',
        'signal',
        'viber',
        'line',
        'wechat',
        'skype',
      ].includes(lowerCaseName)
    ) {
      return 'Messaging';
    }

    return 'Other';
  };

  // Emission rates per hour for each category
  const EMISSION_RATES = {
    'Social Media': 0.1, // kg CO₂ per hour
    Productivity: 0.08, // assuming 0.08 kg CO₂ per hour for Productivity
    Entertainment: 0.15, // kg CO₂ per hour
    Messaging: 0.05, // kg CO₂ per hour
    Other: 0.07, // assuming 0.07 kg CO₂ per hour for Other
  };

  const calculateCarbonEmissions = (
    timeInMilliseconds: number,
    category: string,
  ) => {
    const hours = timeInMilliseconds / (1000 * 60 * 60);
    const rate = EMISSION_RATES[category] || 0;
    return hours * rate; // kg CO₂
  };

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [appUsageData, setAppUsageData] = useState<AppUsageData[]>([]);
  const [connectionInfo, setConnectionInfo] = useState<string>('');
  const [wifiDataUsage, setWifiDataUsage] = useState<number | null>(null);
  const [mobileDataUsage, setMobileDataUsage] = useState<number | null>(null);

  const openSettingsAlert = () => {
    Alert.alert(
      'Permission Required',
      'To view data usage, please enable Usage Access in your device settings.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Open Settings', onPress: () => Linking.openSettings()},
      ],
    );
  };

  const formatTime = (milliseconds: number) => {
    if (!milliseconds) {
      return 'No data';
    }

    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedTime;
  };

  useEffect(() => {
    const checkAndRequestPermission = async () => {
      const hasPermission = await AppUsage.checkPackagePermission();

      if (!hasPermission) {
        await AppUsage.requestUsagePermission();

        const permissionGranted = await AppUsage.checkPackagePermission();

        if (!permissionGranted) {
          Alert.alert(
            'Permission Denied',
            'App usage permission is required to fetch app usage data.',
          );
        }
      }
    };

    checkAndRequestPermission();
  }, []);

  useEffect(() => {
    const fetchAppUsageData = async () => {
      try {
        const endTime = Date.now().toString();
        const startTime = (Date.now() - 24 * 60 * 60 * 1000).toString();

        AppUsage.getUsageCustomRange(
          startTime,
          endTime,
          (data: AppUsageData[]) => {
            console.log('Fetched app usage data:', data);
            const filteredData = data.filter(
              app =>
                (app.lastVisibleTime || 0) > 0 ||
                (app.totalForegroundTime || 0) > 0 ||
                (app.totalVisibleTime || 0) > 0,
            );
            setAppUsageData(filteredData);
          },
        );
      } catch (error) {
        console.error('Error fetching app usage data:', error);
      }
    };

    const fetchDataIfPermitted = async () => {
      const hasPermission = await AppUsage.checkPackagePermission();
      if (hasPermission) {
        setTimeout(fetchAppUsageData, 500);
      }
    };

    fetchDataIfPermitted();
  }, []);

  useEffect(() => {
    const fetchDataUsage = async () => {
      try {
        if (DataUsageModule) {
          const hasPermission =
            await DataUsageModule.requestUsageStatsPermission();
          if (!hasPermission) {
            openSettingsAlert();
            return;
          }

          const result = await DataUsageModule.getTotalDataUsage();
          setMobileDataUsage(result.mobileDataUsage);
          setWifiDataUsage(result.wifiDataUsage);
        } else {
          console.warn('DataUsageModule is not available.');
        }
      } catch (error) {
        console.error('Failed to fetch data usage:', error);
      }
    };

    fetchDataUsage();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConnectionInfo(
        `Type: ${state.type}, Is Connected: ${state.isConnected}`,
      );
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <View title="App Usage Data">
            {appUsageData.length > 0 ? (
              [
                'Social Media',
                'Productivity',
                'Entertainment',
                'Messaging',
                'Other',
              ].map(category => {
                const appsInCategory = appUsageData.filter(
                  app =>
                    getAppCategory(app.packageName.split('.').pop() || '') ===
                    category,
                );

                if (appsInCategory.length === 0) return null;

                // Calculate total time and carbon emissions for the category
                const totalCategoryTime = appsInCategory.reduce(
                  (total, app) => total + app.totalForegroundTime,
                  0,
                );
                const categoryCarbonEmissions = calculateCarbonEmissions(
                  totalCategoryTime,
                  category,
                );

                return (
                  <View key={category}>
                    <Text style={styles.categoryTitle}>{category}</Text>
                    {appsInCategory.map((app, index) => {
                      // Calculate emissions for each app
                      const appCarbonEmissions = calculateCarbonEmissions(
                        app.totalForegroundTime,
                        category,
                      );

                      return (
                        <View key={index} style={styles.appContainer}>
                          <Text style={styles.appName}>
                            {app.packageName.split('.').pop()}
                          </Text>
                          <Text style={styles.appTime}>
                            {formatTime(app.totalForegroundTime)}
                          </Text>
                          <Text style={styles.appCarbonEmissions}>
                            CO₂: {appCarbonEmissions.toFixed(3)} kg
                          </Text>
                          {index < appsInCategory.length - 1 && (
                            <View style={styles.separator} />
                          )}
                        </View>
                      );
                    })}
                    {/* Display total time and emissions for the category */}
                    <Text style={styles.totalCategoryTime}>
                      Total Time: {formatTime(totalCategoryTime)}
                    </Text>
                    <Text style={styles.totalCategoryCarbonEmissions}>
                      Total Carbon Emissions:{' '}
                      {categoryCarbonEmissions.toFixed(3)} kg CO₂
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text>
                No app usage data with visible or foreground time available.
              </Text>
            )}
          </View>

          {/* <Section title="Connection Information">
            <Text>
              {connectionInfo || 'No connection information available.'}
            </Text>
          </Section> */}
          {/* <Section title="Data Usage">
            <View style={styles.dataContainer}>
              <Text style={styles.dataUsageLabel}>
                Wi-Fi Data Usage (Last 24 hours):
              </Text>
              <Text style={styles.dataUsageValue}>
                {wifiDataUsage !== null
                  ? `${(wifiDataUsage / 1024 ** 2).toFixed(2)} MB`
                  : 'Loading...'}
              </Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.dataUsageLabel}>
                Mobile Data Usage (Last 24 hours):
              </Text>
              <Text style={styles.dataUsageValue}>
                {mobileDataUsage !== null
                  ? `${(mobileDataUsage / 1024 ** 2).toFixed(2)} MB`
                  : 'Loading...'}
              </Text>
            </View>
          </Section> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  appContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  appName: {
    fontWeight: '500',
    color: Colors.black,
  },
  appTime: {
    fontWeight: '400',
    color: Colors.black,
  },
  dataContainer: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  dataUsageLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
  dataUsageValue: {
    fontSize: 16,
    fontWeight: '400',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
});
