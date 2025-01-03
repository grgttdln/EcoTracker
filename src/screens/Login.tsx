import React, {useState} from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';

const backgroundImage = require('../assets/images/square_small.png');
const {width, height} = Dimensions.get('window');

const Login = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Logging in with:', email, password);
  };

  const loginWithEmailAndPass = () => {
    if (!email) {
      Alert.alert('Login Error', 'Please enter your email address.');
      return;
    }

    if (!password) {
      Alert.alert('Login Error', 'Please enter your password.');
      return;
    }

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        Alert.alert('Success', 'You have successfully Logged in!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Dashboard'),
          },
        ]);
        navigation.navigate('Dashboard');
      })
      .catch(err => {
        let errorMessage = 'An error occurred while logging in.';

        // Handling common Firebase Auth errors
        if (err instanceof Error && 'code' in err) {
          const errorCode = (err as any).code;

          switch (errorCode) {
            case 'auth/user-not-found':
              errorMessage = 'No account found with this email address.';
              break;
            case 'auth/wrong-password':
              errorMessage = 'Incorrect password. Please try again.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'Please enter a valid email address.';
              break;
            case 'auth/user-disabled':
              errorMessage = 'This account has been disabled.';
              break;
            case 'auth/too-many-requests':
              errorMessage = 'Too many attempts. Please try again later.';
              break;
            case 'auth/invalid-credential':
              errorMessage =
                'The supplied credential is incorrect or has expired. Please try again.';
              break;
            default:
              errorMessage = 'An unknown error occurred. Please try again.';
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        Alert.alert('Login Error', errorMessage);
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.contentWrapper}>
          {/* Title Section */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>EcoTrack</Text>
            <Text style={styles.subtitle}>
              Your Personal Guide to a Greener Future: Track, Reduce, and
              Transform Your Carbon Footprint with Ease
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>E-MAIL</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your e-mail"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {email.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setEmail('')}>
                  <Text style={styles.clearButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.label}>PASSWORD</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                style={styles.input}
                autoCapitalize="none"
              />
              {password.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setPassword('')}>
                  <Text style={styles.clearButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.createAccount}>
                Don't have an account? Let's create one!
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button - Inside ScrollView to scroll with content */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={loginWithEmailAndPass}>
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Back Button - Outside ScrollView to stay fixed */}
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.navigate('Welcome')}>
        <AntIcon name="left" size={24} color="#79A065" />
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backgroundImage: {
    width: width,
    minHeight: height,
  },
  contentWrapper: {
    flex: 1,
    padding: 24,
    paddingTop: 100,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    display: 'flex',
  },

  backButtonText: {
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 20,
    margin: 0,
    color: '#79A065',
  },

  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 50,
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginVertical: 6,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'Poppins-Medium',
  },
  formContainer: {
    marginTop: 28,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    color: '#000',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 20,
    color: '#000',
  },
  createAccount: {
    fontSize: 16,
    color: '#000',
    textAlign: 'left',
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: Platform.OS === 'ios' ? 40 : 80,
  },
  loginButton: {
    backgroundColor: '#79A065',
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
});

export default Login;
