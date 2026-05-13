import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Notification from '../components/Notification';
import firestore, { firebase } from '@react-native-firebase/firestore';
import * as glb from '../scripts/global.js';

import { globalStyles } from '../styles/GlobalStyles';
import { GlobalContext } from '../context/Context';

export default function Notifications({ navigation }) {
  const { darkEnabled, userImg } = useContext(GlobalContext);
  const { hostInformation } = useContext(GlobalContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = firestore()
      .collection('notifications')
      .where(
        'notification_to',
        '==',
        firestore().doc('users/' + hostInformation.key)
      )
      .onSnapshot((qs) => {
        let temp = [];
        qs.forEach((ds) => {
          temp.push({
            ...ds.data(),
            key: ds.id,
            date_sort: new Date(ds.data().notification_date.toDate()),
          });
        });
        glb.orderArrByDateDesc(temp);
        setNotifications(temp);
        setLoading(false);
      });
    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView
      style={
        darkEnabled
          ? styles.notificationsContainerDark
          : styles.notificationsContainer
      }
    >
      <View
        style={
          darkEnabled ? styles.notificationsNavDark : styles.notificationsNav
        }
      >
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
        <Text style={styles.navTitle}>NOTIFICATIONS</Text>
      </View>
      {notifications.map((v, i) => {
        return (
          <Notification
            fetch={v}
            host_id={hostInformation.key}
            navigation={navigation}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  notificationsContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  notificationsContainerDark: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },

  notificationsNav: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#1c1c98',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  notificationsNavDark: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#ffa072',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  navTitle: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    marginLeft: 20,
    marginRight: 'auto',
    paddingRight: 15,
  },

  profilePic: {
    width: 35,
    height: 35,
    borderRadius: 50,
    borderColor: '#1c1c98',
    borderWidth: 3,
  },
});
