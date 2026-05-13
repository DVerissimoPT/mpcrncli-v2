import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { globalStyles } from '../styles/GlobalStyles';
import Metronome from './Metronome';
import Stopwatch from './Stopwatch';
import Forms from './Forms';
import { GlobalContext } from '../context/Context';
import firestore, { firebase } from '@react-native-firebase/firestore';
import FormDetail from './FormDetail';
import StudyPage from './StudyPage';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

const Tab = createMaterialTopTabNavigator();

export default function Practice({ route, navigation }) {
  const {
    darkEnabled,
    userId,
    studyMode,
    formState,
    userImg,
    hostInformation,
    fetchU,
  } = useContext(GlobalContext);
  const { saveHostInfo } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);

  const setDefaultParameters = () => {};

  const saveTokenToDatabase = (token) => {
    firestore()
      .collection('users')
      .doc(userId)
      .update({
        token: token,
      });
  };

  useEffect(() => {
    const userN = fetchU;
    firestore()
      .collection('users')
      .where('email', '==', userN)
      .get()
      .then((qs) => {
        let meusDados = [];
        qs.forEach((ds, i) => {
          meusDados.push({
            ...ds.data(),
            key: ds.id,
          });

          if (i == qs.size - 1) {
            saveHostInfo(meusDados[0]);
            setLoading(false);
          }
        });
      });

    PushNotification.configure({
      onRegister: function(token) {
        console.log(token.token);

        saveTokenToDatabase(token.token);
      },

      onNotification: function(notification) {
        console.log('NOTIFICATION:', notification);
      },
    });

    return messaging().onTokenRefresh((token) => {
      saveTokenToDatabase(token);
    });
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View
      style={
        darkEnabled ? styles.practiceContainerDark : styles.practiceContainer
      }
    >
      <Image
        style={globalStyles.smallLogo}
        source={
          darkEnabled
            ? require('../assets/images/small-logo-white-8.png')
            : require('../assets/images/small-logo-8.png')
        }
      />
      <View style={styles.navContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('FeedStack')}>
          <Image
            style={
              darkEnabled
                ? globalStyles.profilePicDark
                : globalStyles.profilePic
            }
            source={{ uri: userImg }}
          />
        </TouchableOpacity>
        <Text
          style={
            darkEnabled ? globalStyles.navTitleDark : globalStyles.navTitle
          }
        >
          STUDY AREA
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SearchForms')}>
          <View style={globalStyles.searchIcon} />
        </TouchableOpacity>
      </View>

      <Tab.Navigator
        tabBarOptions={
          darkEnabled
            ? {
                tabStyle: { backgroundColor: '#1A1A1A' },
                activeTintColor: '#FFA072',
                inactiveTintColor: '#fff',
              }
            : {
                activeBackgroundColor: '#1C1C98',
                inactiveBackgroundColor: '#fff',
                activeTintColor: '#1C1C98',
                inactiveTintColor: '#808080',
              }
        }
      >
        {studyMode ? (
          formState ? (
            <Tab.Screen name='StudyPage' component={StudyPage} />
          ) : (
            <Tab.Screen
              name='FormDetail'
              component={FormDetail}
              options={{ title: 'TEMPLATE' }}
            />
          )
        ) : (
          <Tab.Screen
            name='Forms'
            component={Forms}
            options={{ title: 'TEMPLATES' }}
          />
        )}
        <Tab.Screen name='Metronome' component={Metronome} />
        <Tab.Screen name='Stopwatch' component={Stopwatch} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  practiceContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },

  practiceContainerDark: {
    backgroundColor: '#1A1A1A',
    flex: 1,
  },

  navContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
});
