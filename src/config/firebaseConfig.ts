import firebase from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDOd-ddv4G9GDspcgkQBoD43uDa5Mupnxk",
  appId: "1:310364857439:android:35b37edec3977782ce67ea",
  databaseURL: undefined, // Set to undefined
  messagingSenderId: "310364857439",
  projectId: "ecotracker-f9c63",
  storageBucket: "ecotracker-f9c63.firebasestorage.app",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
