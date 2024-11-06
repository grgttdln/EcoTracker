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
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import AppUsage from 'react-native-app-usage';

interface AppUsageData {
  packageName: string;
  totalTimeInForeground: number;
  lastVisibleTime: number;
  totalForegroundTime: number;
  totalVisibleTime: number;
}

const APP_NAME_MAPPINGS: { [key: string]: string } = {
  'com.facebook.katana': 'Facebook',
  'com.facebook.orca': 'Facebook Messenger',
  'com.instagram.android': 'Instagram',
  'com.ecotrack': 'EcoTrack',
  'com.twitter.android': 'Twitter',
  'com.snapchat.android': 'Snapchat',
  'com.linkedin.android': 'LinkedIn',
  'com.pinterest': 'Pinterest',
  'com.reddit.frontpage': 'Reddit',
  'com.whatsapp': 'WhatsApp',
  'org.telegram.messenger': 'Telegram',
  'com.microsoft.office.outlook': 'Outlook',
  'com.google.android.apps.docs': 'Google Docs',
  'com.google.android.apps.sheets': 'Google Sheets',
  'com.google.android.apps.drive': 'Google Drive',
  'com.microsoft.teams': 'Microsoft Teams',
  'com.netflix.mediaclient': 'Netflix',
  'com.spotify.music': 'Spotify',
  'com.amazon.avod.thirdpartyclient': 'Amazon Prime Video',
  'com.google.android.youtube': 'YouTube',
  'com.hulu.plus': 'Hulu',
  'com.disney.disneyplus': 'Disney+',
  'tv.twitch.android.app': 'Twitch',
  'com.skype.raider': 'Skype',
  'com.viber.voip': 'Viber',
  'jp.naver.line.android': 'LINE',
  'com.wechat': 'WeChat',
  'com.evernote': 'Evernote',
  'com.notionlabs.notion': 'Notion',
  'com.slack': 'Slack',
  'com.vimeo.android.videoapp': 'Vimeo',
  // Add more mappings as needed.
};

const getAppDisplayName = (packageName: string): string => {
  return APP_NAME_MAPPINGS[packageName] || packageName;
};

export default function Carbon(): React.JSX.Element {
  const getAppCategory = (appName: string): string => {
    const lowerCaseName = appName.toLowerCase();
    const nameParts = lowerCaseName.split('.');
    const matchesCategory = (parts: string[], categoryArray: string[]) =>
      parts.some(part => categoryArray.includes(part));

    if (
      matchesCategory(nameParts, [
        'katana',
        'instagram',
        'twitter',
        'ugc',
        'linkedin',
        'pinterest',
        'snapchat',
        'reddit',
        'messenger',
      ])
    ) {
      return 'Social Media';
    }
    if (
      matchesCategory(nameParts, [
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
      ])
    ) {
      return 'Productivity';
    }
    if (
      matchesCategory(nameParts, [
        'youtube',
        'netflix',
        'spotify',
        'prime',
        'hulu',
        'disney',
        'twitch',
        'vimeo',
      ])
    ) {
      return 'Entertainment';
    }
    if (
      matchesCategory(nameParts, [
        'whatsapp',
        'telegram',
        'orca',
        'signal',
        'viber',
        'line',
        'wechat',
        'skype',
      ])
    ) {
      return 'Messaging';
    }
    return 'Other';
  };

  const EMISSION_RATES = {
    'Social Media': 0.1,
    Productivity: 0.08,
    Entertainment: 0.15,
    Messaging: 0.05,
    Other: 0.07,
  };

  const DATA_USAGE_RATES = {
    'Social Media': 150,
    Productivity: 30,
    Entertainment: 1000,
    Messaging: 50,
    Other: 60,
  };

  const calculateCarbonEmissions = (
    timeInMilliseconds: number,
    category: string,
  ) => {
    const hours = timeInMilliseconds / (1000 * 60 * 60);
    return hours * (EMISSION_RATES[category] || 0);
  };

  const calculateDataUsage = (timeInMilliseconds: number, category: string) => {
    const hours = timeInMilliseconds / (1000 * 60 * 60);
    return hours * (DATA_USAGE_RATES[category] || 0);
  };

  const [appUsageData, setAppUsageData] = useState<AppUsageData[]>([]);

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    return `${hours}h ${minutes}m`; // Use backticks for template literals
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

    fetchAppUsageData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <View style={styles.mainContent}>
          {appUsageData.length > 0 ? (
            [
              'Social Media',
              'Productivity',
              'Entertainment',
              'Messaging',
              'Other',
            ].map(category => {
              const appsInCategory = appUsageData.filter(
                app => getAppCategory(app.packageName) === category,
              );

              if (appsInCategory.length === 0) return null;

              const totalCategoryTime = appsInCategory.reduce(
                (total, app) => total + app.totalForegroundTime,
                0,
              );
              const categoryCarbonEmissions = calculateCarbonEmissions(
                totalCategoryTime,
                category,
              );
              const categoryDataUsage = calculateDataUsage(
                totalCategoryTime,
                category,
              );

              return (
                <View key={category} style={styles.dataContainer}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  {appsInCategory.map((app, index) => {
                    const appName = APP_NAME_MAPPINGS[app.packageName] || app.packageName;
                    const appCarbonEmissions = calculateCarbonEmissions(
                      app.totalForegroundTime,
                      category,
                    );
                    const appDataUsage = calculateDataUsage(
                      app.totalForegroundTime,
                      category,
                    );

                    return (
                      <View key={index} style={styles.appContainer}>
                        <Text style={styles.appName}>{appName}</Text>
                        <Text style={styles.appTime}>
                          Time: {formatTime(app.totalForegroundTime)}
                        </Text>
                        <Text style={styles.appDataUsage}>
                          Data Usage: {appDataUsage.toFixed(2)} MB
                        </Text>
                        <Text style={styles.appCarbonEmissions}>
                          CO₂: {appCarbonEmissions.toFixed(3)} kg
                        </Text>
                      </View>
                    );
                  })}
                  <Text style={styles.totalCategoryTime}>
                    Total Time: {formatTime(totalCategoryTime)}
                  </Text>
                  <Text style={styles.totalCategoryDataUsage}>
                    Total Data Usage: {categoryDataUsage.toFixed(2)} MB
                  </Text>
                  <Text style={styles.totalCategoryCarbonEmissions}>
                    Total CO₂ Emissions: {categoryCarbonEmissions.toFixed(3)} kg
                  </Text>
                </View>
              );
            })
          ) : (
            <Text>No app usage data with visible or foreground time available.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    backgroundColor: '#ffffff',
  },
  mainContent: {
    backgroundColor: '#ffffff',
  },
  dataContainer: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
  },
  appContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  appName: {
    fontWeight: '500',
  },
  appTime: {
    fontWeight: '400',
  },
  appDataUsage: {
    fontWeight: '400',
  },
  appCarbonEmissions: {
    fontWeight: '400',
  },
  totalCategoryTime: {
    fontWeight: '600',
    marginTop: 8,
  },
  totalCategoryDataUsage: {
    fontWeight: '600',
  },
  totalCategoryCarbonEmissions: {
    fontWeight: '600',
  },
});
