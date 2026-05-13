import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import Messages from '../components/Messages';
import People from './People';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { globalStyles } from '../styles/GlobalStyles';

import { GlobalContext } from '../context/Context';

const Tab = createMaterialTopTabNavigator();

export default function Chat({ navigation }) {
  const { darkEnabled, isBarVisible, userImg } = useContext(GlobalContext);
  return (
    <View style={styles.chatContainer}>
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
            MESSAGES
          </Text>
          <TouchableHighlight>
            <View style={globalStyles.searchIcon} />
          </TouchableHighlight>
        </View>
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
        <Tab.Screen name='Messages' component={Messages} />
        <Tab.Screen name='People' component={People} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  chatTop: {
    backgroundColor: '#fff',
  },

  chatTopDark: {
    backgroundColor: '#1a1a1a',
  },

  chatTop: {
    backgroundColor: '#fff',
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
