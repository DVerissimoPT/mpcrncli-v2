import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Button,
  Switch,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { GlobalContext } from '../context/Context';
import { globalStyles } from '../styles/GlobalStyles';

export default function Settings({ route, navigation }) {
  const {
    darkEnabled,
    toggleTheme,
    notificationsTimer,
    toggleNotificationsSettings,
    userImg,
  } = useContext(GlobalContext);
  const signOutHandler = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('user signed out');
      });
  };

  return (
    <ScrollView
      style={
        darkEnabled ? styles.settingsContainerDark : styles.settingsContainer
      }
    >
      <View style={darkEnabled ? styles.chatTopDark : styles.chatTop}>
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
            SETTINGS
          </Text>
          <View style={{ width: 20 }} />
        </View>
      </View>
      <View style={styles.settingsBtn}>
        <Text
          style={darkEnabled ? styles.settingsTextDark : styles.settingsText}
        >
          Dark Mode
        </Text>
        <Switch
          onValueChange={toggleTheme}
          value={darkEnabled}
          thumbColor={darkEnabled ? '#ffa072' : '#aaa'}
          trackColor={{ false: '#ddd', true: '#ddd' }}
        />
      </View>
      <View style={styles.settingsBtn}>
        <Text
          style={darkEnabled ? styles.settingsTextDark : styles.settingsText}
        >
          Study Mode
        </Text>
        <Switch
          thumbColor={darkEnabled ? '#aaa' : '#aaa'}
          trackColor={{ false: '#ddd', true: '#ddd' }}
        />
      </View>
      <View style={styles.settingsBtnNotifications}>
        <Text
          style={darkEnabled ? styles.settingsTextDark : styles.settingsText}
        >
          Notifications
        </Text>
        <View style={styles.settingsNotifications}>
          <Text
            style={darkEnabled ? styles.settingsTextDark : styles.settingsText}
          >
            Mentions
          </Text>
          <Switch
            trackColor='#ddd'
            thumbColor={darkEnabled ? '#aaa' : '#aaa'}
            trackColor={{ false: '#ddd', true: '#ddd' }}
          />
        </View>
        <View style={styles.settingsNotifications}>
          <Text
            style={darkEnabled ? styles.settingsTextDark : styles.settingsText}
          >
            Messages
          </Text>
          <Switch
            thumbColor={darkEnabled ? '#aaa' : '#aaa'}
            trackColor={{ false: '#ddd', true: '#ddd' }}
          />
        </View>
        <View style={styles.settingsNotifications}>
          <Text
            style={darkEnabled ? styles.settingsTextDark : styles.settingsText}
          >
            Timer
          </Text>
          <Switch
            thumbColor={
              darkEnabled
                ? notificationsTimer
                  ? '#ffa072'
                  : '#aaa'
                : notificationsTimer
                ? '#1c1c98'
                : '#aaa'
            }
            trackColor={{ false: '#ddd', true: '#ddd' }}
            value={notificationsTimer}
            onValueChange={(value) => toggleNotificationsSettings(value)}
          />
        </View>
        <View style={styles.settingsNotifications}>
          <Text
            style={darkEnabled ? styles.settingsTextDark : styles.settingsText}
          >
            Likes
          </Text>
          <Switch
            thumbColor={darkEnabled ? '#aaa' : '#aaa'}
            trackColor={{ false: '#ddd', true: '#ddd' }}
          />
        </View>
        <View style={styles.settingsNotifications}>
          <Text
            style={darkEnabled ? styles.settingsTextDark : styles.settingsText}
          >
            Comments
          </Text>
          <Switch
            thumbColor={darkEnabled ? '#aaa' : '#aaa'}
            trackColor={{ false: '#ddd', true: '#ddd' }}
          />
        </View>
        <View style={styles.settingsNotifications}>
          <Text
            style={darkEnabled ? styles.settingsTextDark : styles.settingsText}
          >
            Follows
          </Text>
          <Switch
            thumbColor={darkEnabled ? '#aaa' : '#aaa'}
            trackColor={{ false: '#ddd', true: '#ddd' }}
          />
        </View>
      </View>
      <Button
        title='Log Out'
        onPress={signOutHandler}
        color={darkEnabled ? '#ffa072' : '#ffa072'}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  settingsContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },

  settingsContainerDark: {
    backgroundColor: '#1a1a1a',
    flex: 1,
  },

  chatTop: {
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },

  chatTopDark: {
    backgroundColor: '#1a1a1a',
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

  navTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: '#1C1C98',
    alignSelf: 'center',
  },

  navTitleDark: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: '#fff',
  },

  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },

  settingsText: {
    color: '#1c1c98',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },

  settingsTextDark: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },

  settingsBtnNotifications: {
    flexDirection: 'column',
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 15,
    paddingBottom: 25,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },

  settingsNotifications: {
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
  },
});
