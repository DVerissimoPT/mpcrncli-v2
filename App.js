import 'react-native-gesture-handler';
import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PushNotification from 'react-native-push-notification';
import Onboarding from 'react-native-onboarding-swiper';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Keyboard,
  Button,
  Image,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SignUp from './pages/SignUp';
import Feed from './pages/Feed';
import Practice from './pages/Practice';
import Notifications from './pages/Notifications';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import FeedStack from './stacks/FeedStack';
import PracticeStack from './stacks/PracticeStack';
import ChatStack from './stacks/ChatStack';
import NotificationStack from './stacks/NotificationStack';
import firestore, { firebase } from '@react-native-firebase/firestore';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Login from './pages/Login';
import auth from '@react-native-firebase/auth';
import { color } from 'react-native-reanimated';
import GlobalContextProvider, { GlobalContext } from './context/Context';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [darkEnabledApp, setDarkEnabledApp] = useState(false);
  const [barVisible, setBarVisible] = useState(true);
  const [firstTime, setFirstTime] = useState(false);
  const [userSet, setUserSet] = useState(false);
  const [userN, setUserN] = useState('');

  function fetchUsername() {
    const user = firebase.auth().currentUser;
    let email = user.email;
    return email;
  }

  function checkTut(e) {
    firestore()
      .collection('users')
      .where('email', '==', e)
      .get()
      .then((qs) => {
        qs.forEach((ds) => {
          let data = ds.data();
          let data_key = Object.keys(data);
          if (data_key.includes('firstTime')) {
            if (data['firstTime'] === true) {
              setFirstTime(true);
            } else {
              setFirstTime(false);
            }
          } else {
            firestore()
              .doc('users/' + ds.id)
              .update({
                firstTime: true,
              });
            setFirstTime(true);
          }
        });
      });
  }

  function markTutAsDone(e) {
    firestore()
      .collection('users')
      .where('email', '==', e)
      .get()
      .then((qs) => {
        qs.forEach((ds) => {
          firestore()
            .doc('users/' + ds.id)
            .update({
              firstTime: false,
            })
            .then(() => {
              setFirstTime(false);
            });
        });
      });
  }

  if (user) {
    if (!userSet) {
      setUserN(fetchUsername());
      setUserSet(true);
    }
    checkTut(userN);
  }

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  function isBarVisible(bool) {
    setBarVisible(bool);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    return subscriber;
  }, []);

  if (initializing) {
    return null;
  }

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen
            name='Login'
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='SignUp'
            component={SignUp}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    if (firstTime) {
      return (
        <Onboarding
          onDone={() => {
            markTutAsDone(userN);
          }}
          onSkip={() => {
            markTutAsDone(userN);
          }}
          // bottomBarColor='#1C1C98'
          imageContainerStyles={{ padding: 60, display: 'flex' }}
          containerStyles={{ paddingBottom: 60 }}
          titleStyles={{ fontFamily: 'Nunito-Bold', color: '#1C1C98' }}
          pages={[
            {
              backgroundColor: '#fff',
              image: (
                <Image source={require('./assets/images/tutoriais-109.png')} />
              ),
              title: 'Connect with your friends',
              subtitle:
                'Use the social area to share your progress and connect to your friends',
            },
            {
              backgroundColor: '#fff',
              image: (
                <Image source={require('./assets/images/tutoriais-110.png')} />
              ),
              title: 'Focus on one thing at a time',
              subtitle:
                'Create practice forms to help you study. Divide your practice into different parameters to train them one by one.',
            },
            {
              backgroundColor: '#fff',
              image: (
                <Image source={require('./assets/images/tutoriais-111.png')} />
              ),
              title: 'Manage Your Time',
              subtitle:
                'Use the timer to set study and break times to help you organize your study sessions.',
            },
          ]}
        />
      );
    }

    return (
      <GlobalContextProvider
        setDarkEnabledApp={setDarkEnabledApp}
        darkEnabledApp={darkEnabledApp}
        isBarVisible={isBarVisible}
      >
        {darkEnabledApp ? (
          <StatusBar backgroundColor='#FFA072' />
        ) : (
          <StatusBar backgroundColor='#1C1C98' />
        )}

        <NavigationContainer>
          <Tab.Navigator
            initialRouteName='PracticeStack'
            tabBarOptions={
              darkEnabledApp
                ? {
                    activeBackgroundColor: '#FFA072',
                    inactiveBackgroundColor: '#1A1A1A',
                    activeTintColor: '#fff',
                    inactiveTintColor: '#fff',
                    showLabel: false,
                  }
                : {
                    activeBackgroundColor: '#1C1C98',
                    inactiveBackgroundColor: '#fff',
                    activeTintColor: '#fff',
                    inactiveTintColor: '#1C1C98',
                    showLabel: false,
                  }
            }
          >
            <Tab.Screen
              name='FeedStack'
              component={FeedStack}
              options={
                barVisible
                  ? {
                      tabBarVisible: true,
                      tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                          name='home-outline'
                          color={color}
                          size={26}
                        />
                      ),
                    }
                  : { tabBarVisible: false }
              }
            />
            <Tab.Screen
              name='NotificationStack'
              component={NotificationStack}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name='bell-outline'
                    color={color}
                    size={26}
                  />
                ),
              }}
            />
            <Tab.Screen
              name='PracticeStack'
              component={PracticeStack}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name='music-circle-outline'
                    color={color}
                    size={26}
                  />
                ),
              }}
            />
            <Tab.Screen
              name='Chat'
              component={ChatStack}
              options={
                barVisible
                  ? {
                      tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                          name='message-outline'
                          color={color}
                          size={26}
                        />
                      ),
                    }
                  : { tabBarVisible: false }
              }
            />
            <Tab.Screen
              name='Settings'
              component={Settings}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name='tune' color={color} size={26} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </GlobalContextProvider>
    );
  }
};

const styles = StyleSheet.create({});

export default App;
