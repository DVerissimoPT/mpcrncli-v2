import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Modal,
} from 'react-native';
import { globalStyles } from '../styles/GlobalStyles.js';
import LoginButton from '../components/LoginButton.js';
import SocialBtn from '../components/SocialBtn.js';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native-paper';
import storage from '@react-native-firebase/storage';

export default function SignUp({ navigation }) {
  //state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  //effect
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
  });

  //animações teclado
  const _keyboardDidShow = () => {
    setKeyboardOpen(true);
  };

  const _keyboardDidHide = () => {
    setKeyboardOpen(false);
  };

  const popSignUp = () => {
    navigation.goBack();
  };

  const getProfileImg = async () => {
    let randomPhoto = Math.floor(Math.random() * 4 + 1);
    let url = await storage()
      .ref(`images/default_profile/profile-img-${randomPhoto}.png`)
      .getDownloadURL();

    return url;
  };

  const signUpHandler = () => {
    setLoading(true);

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        getProfileImg()
          .then((url) => {
            firestore()
              .collection('users')
              .add({
                username: username,
                email: email,
                bio: '',
                profilePic: url,
                token: '',
              });
          })
          .then(() => {
            setLoading(false);
            console.log('User account created & signed in!');
          });
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
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
          <Image
            source={require('../assets/images/logo-hor.png')}
            style={
              keyboardOpen == false
                ? globalStyles.logoHor
                : globalStyles.logoKeyboardShow
            }
          />

          <KeyboardAvoidingView
            style={globalStyles.keyboardMoveSignIn}
            behavior='position'
          >
            <Text style={globalStyles.loginTitle}>Sign Up</Text>
            <Text style={globalStyles.errorMessage}>{error}</Text>

            <TextInput
              onChangeText={(text) => {
                setUsername(text);
              }}
              style={globalStyles.loginInput}
              placeholder='Username'
              placeholderTextColor='#fff'
              maxLength={15}
            />
            <TextInput
              onChangeText={(text) => setEmail(text)}
              style={globalStyles.loginInput}
              placeholder='Email'
              placeholderTextColor='#fff'
              autoCapitalize='none'
            />
            <TextInput
              onChangeText={(text) => setPassword(text)}
              style={globalStyles.loginInput}
              placeholder='Password'
              secureTextEntry={true}
              placeholderTextColor='#fff'
            />

            <LoginButton
              text='Sign Up'
              style={globalStyles.signInButton}
              signUpHandler={signUpHandler}
              type='Sign Up'
            />
          </KeyboardAvoidingView>

          <Text style={globalStyles.or}>or sign up with</Text>

          <View style={globalStyles.socialBtnContainer}>
            <SocialBtn socialIcon='1' />
            <SocialBtn socialIcon='2' />
            <SocialBtn socialIcon='3' />
          </View>

          <View style={globalStyles.noAccount}>
            <Text style={globalStyles.noAccountText}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={popSignUp}>
              <Text style={globalStyles.noAccountSignText}> Sign in!</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
