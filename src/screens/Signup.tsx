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
  ActivityIndicator,
} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';
import NetInfo from '@react-native-community/netinfo';

const backgroundImage = require('../assets/square_small.png');
const {width, height} = Dimensions.get('window');

const Signup = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateInputs = () => {
    if (!email || !password || !confirmPassword || !username) {
      setError('All fields are required');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const checkNetwork = async () => {
    const networkState = await NetInfo.fetch();
    return networkState.isConnected;
  };

  const handleSignup = async () => {
    try {
      setError('');
      
      if (!validateInputs()) {
        return;
      }

      setLoading(true);

      // Check network connection
      const isConnected = await checkNetwork();
      if (!isConnected) {
        throw new Error('No internet connection. Please check your network settings and try again.');
      }

      // Create user with email and password
      await auth().createUserWithEmailAndPassword(email, password);
      
      // Update user profile with username
      const currentUser = auth().currentUser;
      if (currentUser) {
        await currentUser.updateProfile({
          displayName: username
        });
      }

      Alert.alert(
        "Success",
        "Your account has been created successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate('Login')
          }
        ]
      );

    } catch (error) {
      let errorMessage = 'An error occurred during signup';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email address is already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled';
          break;
        case 'auth/weak-password':
          errorMessage = 'Please choose a stronger password';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection and try again';
          break;
      }

      setError(errorMessage);
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode="cover">
          <View style={styles.contentWrapper}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>EcoTrack</Text>
              <Text style={styles.subtitle}>
                Your Personal Guide to a Greener Future: Track, Reduce, and
                Transform Your Carbon Footprint with Ease
              </Text>
            </View>

            <View style={styles.formContainer}>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Text style={styles.label}>E-MAIL</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                  }}
                  placeholder="Enter your e-mail"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
                {email.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setEmail('')}
                    disabled={loading}>
                    <Text style={styles.clearButtonText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  secureTextEntry
                  style={styles.input}
                  autoCapitalize="none"
                  editable={!loading}
                />
                {password.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setPassword('')}
                    disabled={loading}>
                    <Text style={styles.clearButtonText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>CONFIRM PASSWORD</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setError('');
                  }}
                  placeholder="Confirm your password"
                  secureTextEntry
                  style={styles.input}
                  autoCapitalize="none"
                  editable={!loading}
                />
                {confirmPassword.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setConfirmPassword('')}
                    disabled={loading}>
                    <Text style={styles.clearButtonText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>WHAT SHOULD WE CALL YOU?</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    setError('');
                  }}
                  placeholder="Enter your username"
                  style={styles.input}
                  autoCapitalize="none"
                  editable={!loading}
                />
                {username.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setUsername('')}
                    disabled={loading}>
                    <Text style={styles.clearButtonText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity 
                onPress={() => navigation.navigate('Login')}
                disabled={loading}>
                <Text style={styles.createAccount}>
                  Already have an account? Let's Sign In!
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleSignup}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.loginButtonText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>

      <Pressable
        style={styles.backButton}
        onPress={() => navigation.navigate('Welcome')}
        disabled={loading}>
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

export default Signup;
