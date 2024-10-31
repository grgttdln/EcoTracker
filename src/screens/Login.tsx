import React, { useState } from 'react';
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
} from 'react-native';

const backgroundImage = require('../assets/square_small.png');
const { width, height } = Dimensions.get('window');

const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Logging in with:', email, password);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
     
        <ImageBackground 
          source={backgroundImage} 
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.contentWrapper}>
            {/* Title Section */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>EcoTrack</Text>
              <Text style={styles.subtitle}>
                Your Personal Guide to a Greener Future: Track, Reduce, and Transform Your Carbon Footprint with Ease
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
                    onPress={() => setEmail('')}
                  >
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
                    onPress={() => setPassword('')}
                  >
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
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
     

      {/* Back Button - Outside ScrollView to stay fixed */}
      <Pressable style={styles.backButton} onPress={() => navigation.navigate('Welcome')}>
        <Text style={styles.backButtonText}>←</Text>
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
    color: "#79A065"
  },
  
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 50,
    fontWeight: '900',
    color: '#000000',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
  },
  formContainer: {
    marginTop: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
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
  },
});

export default Login;