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
  ImageBackground,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import AppUsage from 'react-native-app-usage';
import UserHeader from '../components/UserHeader';
import {BarChart, ProgressChart} from 'react-native-chart-kit';

interface AppUsageData {
  packageName: string;
  totalTimeInForeground: number;
  lastVisibleTime: number;
  totalForegroundTime: number;
  totalVisibleTime: number;
}

const APP_NAME_MAPPINGS: {[key: string]: string} = {
  'com.facebook.katana': 'Facebook',
  'com.facebook.orca': 'Messenger',
  'com.instagram.android': 'Instagram',
  'com.ss.android.ugc.trill': 'TikTok',
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
  'com.microsoft.office.excel': 'Microsoft Excel',
  'com.microsoft.office.word': 'Microsoft Word',
  'com.microsoft.office.powerpoint': 'Microsoft PowerPoint',
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

const bgImage = require('../assets/images/carbon_bg.png');
const socmedIcon = require('../assets/images/socmedIcon.png');

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
        'microsoft',
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

  const DATA_USAGE_EMISSION_RATES = {
    'Social Media': 0.2,
    Productivity: 0.2,
    Entertainment: 0.2,
    Messaging: 0.2,
    Other: 0.2,
  };

  const calculateTotalCarbonEmissions = (
    timeInMilliseconds: number,
    dataUsageInMB: number,
    category: string,
  ) => {
    const hours = timeInMilliseconds / (1000 * 60 * 60);

    // Calculate carbon emissions based on time spent
    const timeBasedEmissions = hours * (EMISSION_RATES[category] || 0);

    // Calculate carbon emissions based on data usage
    const dataUsageInGB = dataUsageInMB / 1024; // Convert MB to GB
    const dataBasedEmissions =
      dataUsageInGB * (DATA_USAGE_EMISSION_RATES[category] || 0);

    // Add both emissions to get total carbon emissions for this category
    return timeBasedEmissions + dataBasedEmissions;
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

  const [emissionData, setEmissionData] = useState({
    'Social Media': 0,
    Productivity: 0,
    Entertainment: 0,
    Messaging: 0,
    Other: 0,
  });

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
            const categoryEmissions = {
              'Social Media': 0,
              Productivity: 0,
              Entertainment: 0,
              Messaging: 0,
              Other: 0,
            };

            filteredData.forEach(app => {
              const category = getAppCategory(app.packageName);
              const totalTime = app.totalForegroundTime;
              const dataUsage = calculateDataUsage(totalTime, category);
              const carbonEmissions = calculateTotalCarbonEmissions(
                totalTime,
                dataUsage,
                category,
              );
              categoryEmissions[category] += carbonEmissions;
            });

            setAppUsageData(filteredData);
            setEmissionData(categoryEmissions);
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
      <UserHeader />

      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        {/* Carbon Emission Goal */}
        <View style={styles.mainContent}>
          {/* <Text style={styles.titleSection}>Carbon Emission Goal</Text> */}
        </View>

       {/* Carbon Emission Monitoring */}
        <View style={styles.mainContent}>
          <Text style={styles.titleSection}>Carbon Emission Monitoring</Text>

          <View style={styles.chartContainer}>
            <BarChart
              data={{
                labels: [
                  'Social Media',
                  'Productivity',
                  'Entertainment',
                  'Messaging',
                  'Other',
                ],
                datasets: [
                  {
                    data: [
                      emissionData['Social Media'],
                      emissionData['Productivity'],
                      emissionData['Entertainment'],
                      emissionData['Messaging'],
                      emissionData['Other'],
                    ],
                  },
                ],
              }}
              width={Dimensions.get('window').width * 0.9} // Adjust width to fit within screen bounds
              height={240}
              yAxisLabel=""
              withInnerLines={false}
              chartConfig={{
                backgroundColor: '#F8FCF6',
                backgroundGradientFrom: '#F8FCF6',
                backgroundGradientTo: '#F8FCF6',
                decimalPlaces: 2,
                color: () => `#0E3327`,
                labelColor: () => `rgba(6, 69, 49, 1)`,
                barPercentage: 0.4, // Further reduce for better spacing
                propsForLabels: {
                  fontSize: 10, 
                  fontFamily: 'Poppins-medium',
                },
                propsForHorizontalLabels: {
                  dy: 10, 
                },
              }}
              style={styles.chartStyle}
              fromZero
              showBarTops={false}
            />
          </View>
        </View>



        {/* Usage Breakdown */}
        <View style={styles.mainContent}>
          {/* <ImageBackground source={bgImage} style={styles.backgroundImage}> */}
          {/* <Text style={styles.titleSection}>Usage Breakdown</Text> */}
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
              const categoryDataUsage = calculateDataUsage(
                totalCategoryTime,
                category,
              );

              const totalCategoryCarbonEmissions =
                calculateTotalCarbonEmissions(
                  totalCategoryTime,
                  categoryDataUsage,
                  category,
                );

              const getIconByCategory = category => {
                switch (category) {
                  case 'Productivity':
                    return require('../assets/images/productivityIcon.png');
                  case 'Social Media':
                    return require('../assets/images/socmedIcon.png');
                  case 'Entertainment':
                    return require('../assets/images/entertainmentIcon.png');
                  case 'Messaging':
                    return require('../assets/images/messagingIcon.png');
                  default:
                    return require('../assets/images/otherIcon.png');
                }
              };

              return (
                <View key={category} style={styles.dataContainer}>
                  <Image
                    source={getIconByCategory(category)}
                    style={styles.picIcons}
                  />
                  <View>
                    <Text style={styles.categoryTitle}>{category}</Text>
                    <View style={styles.miniDataContainer}>
                      <View style={styles.infoContainer}>
                        <Text style={styles.info}>
                          {formatTime(totalCategoryTime)}
                        </Text>
                        <Text style={styles.label}>Time Spent</Text>
                      </View>
                      <View style={styles.infoContainer}>
                        <Text style={styles.info}>
                          {categoryDataUsage.toFixed(2)} MB
                        </Text>
                        <Text style={styles.label}>Data Usage</Text>
                      </View>
                      <View style={styles.infoContainer}>
                        <Text style={styles.info}>
                          {totalCategoryCarbonEmissions.toFixed(2)} kg CO₂e
                        </Text>
                        <Text style={styles.label}>Carbon Emission</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <Text>
              No app usage data with visible or foreground time available.
            </Text>
          )}
          {/* </ImageBackground> */}
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
    padding: 20,
    // marginBottom: 120,
  },
  mainContent: {
    backgroundColor: '#ffffff',
  },
  dataContainer: {
    backgroundColor: '#F8FCF6',
    borderRadius: 20,
    padding: 26,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#7BA065',
    borderWidth: 1,
  },
  miniDataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  backgroundImage: {
    flex: 1,
    padding: 15,
    resizeMode: 'cover',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#203B2F',
    marginBottom: 10,
    marginLeft: 8,
  },
  appContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
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
  appsGroupContainer: {
    borderWidth: 1,
    backgroundColor: '#EBF1E8',
    borderColor: '#7BA065',
  },
  picIcons: {
    width: 80,
    height: 80,
    marginRight: 0,
  },
  infoContainer: {
    alignItems: 'flex-start',
    marginRight: 10,
  },
  label: {
    fontSize: 12,
    color: '#203B2F',
  },
  info: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#203B2F',
  },
  titleSection: {
    fontSize: 18,
    fontWeight: '700',
    color: '#056B4B',
    // marginBottom: 10,
    // marginLeft: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  chartContainer: {
    backgroundColor: '#F8FCF6',
    paddingVertical: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.2,
    // shadowRadius: 8,
    // elevation: 4,
    marginBottom: 20,
    borderColor: '#7BA065',
    borderWidth: 1,
  },
  chartStyle: {
    // backgroundColor: '#F8FCF6',
    borderRadius: 16,
    marginVertical: 8,
  },
});
