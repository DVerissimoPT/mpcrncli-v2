import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import LoginButton from '../components/LoginButton.js';
import SocialBtn from '../components/SocialBtn.js';
import { globalStyles } from '../styles/GlobalStyles.js';
import auth from '@react-native-firebase/auth';
import { ActivityIndicator } from 'react-native-paper';

export default function Login({ navigation }) {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [email, setEmail] = useState(' ');
  const [password, setPassword] = useState(' ');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
  });

  const loginHandler = () => {
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User logged in');
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        console.log(error.message);
        setLoading(false);
      });
  };

  const _keyboardDidShow = () => {
    setKeyboardOpen(true);
  };

  const _keyboardDidHide = () => {
    setKeyboardOpen(false);
  };

  const navSignUp = () => {
    navigation.navigate('SignUp', {
      keyboardOpen: keyboardOpen,
    });
  };

  return (
    <ImageBackground
      source={require('../assets/images/bg-log.png')}
      style={globalStyles.background}
    >
      {loading ? (
        <ActivityIndicator size='large' color='#fff' />
      ) : (
        <>
          <KeyboardAvoidingView
            style={globalStyles.keyboardMoveSignIn}
            behavior='position'
          >
            <View>
              <StatusBar
                hidden={true}
                barStyle='light-content'
                backgroundColor='blue'
              />
            </View>

            <Image
              source={require('../assets/images/logo-hor.png')}
              style={
                keyboardOpen == false
                  ? globalStyles.logoHor
                  : globalStyles.logoKeyboardShow
              }
            />
            <Text style={globalStyles.loginTitle}>Sign In</Text>
            <Text style={globalStyles.errorMessage}>{error}</Text>
            <TextInput
              onChangeText={(text) => {
                setEmail(text.replace(/\s+/g, ''));
              }}
              style={globalStyles.loginInput}
              placeholder='Email'
              placeholderTextColor='#fff'
              autoCapitalize='none'
            />
            <TextInput
              onChangeText={(text) => {
                setPassword(text);
              }}
              style={globalStyles.loginInput}
              placeholder='Password'
              secureTextEntry={true}
              placeholderTextColor='#fff'
            />
            <LoginButton
              text='Sign In'
              style={globalStyles.signInButton}
              loginHandler={loginHandler}
              type='Sign In'
            />
          </KeyboardAvoidingView>

          <Text style={globalStyles.or}>or</Text>

          <View style={globalStyles.socialBtnContainer}>
            <SocialBtn socialIcon='1' />
            <SocialBtn socialIcon='2' />
            <SocialBtn socialIcon='3' />
          </View>

          <TouchableOpacity>
            <Text style={globalStyles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>

          <View style={globalStyles.noAccount}>
            <Text style={globalStyles.noAccountText}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={navSignUp}>
              <Text style={globalStyles.noAccountSignText}> Sign up now!</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
