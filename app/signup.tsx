import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function Signup() {

  // States for signup form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isDisabled = 
  !fullName.trim() || 
  !email.trim() || 
  !password.trim() || 
  !confirmPassword.trim();

  // Get signUp function from auth context
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    const error = await signUp(email, password, fullName);
    setLoading(false);
    if (error) {
      Alert.alert('Sign Up Failed', error);
    } else {
      Alert.alert('Success', 'Account created successfully');
      router.replace('/login');
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.content}>
        <Text style={styles.h1}>Create Account</Text>
        <Text style={styles.sub}>Sign up to start taking notes.</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          autoCapitalize="words"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Pressable
          disabled={isDisabled || loading}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            (isDisabled || loading) && styles.buttonDisabled,
          ]}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
      </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  content: {
    gap: 12,
    alignItems: 'center',
  },
  h1: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
  },
  sub: {
    fontSize: 14,
    opacity: 0.8,
    color: '#111',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 44,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ededed',
    fontSize: 15,
    color: '#111',
  },
  button: {
    width: '100%',
    marginTop: 8,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 1 }],
    backgroundColor: '#999',
  },
  buttonDisabled: {
    opacity: 0.8,
    backgroundColor: '#999',
  },
  buttonText: {
    fontSize: 17,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});