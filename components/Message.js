import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { GlobalContext } from '../context/Context';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native-paper';

export default function Message({ name, navigation }) {
  const { darkEnabled, fetchU } = useContext(GlobalContext);
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  const [intervalTime, setIntervalTime] = useState('');
  const [lastMessage, setLastMessage] = useState('');
  const [lastMessageDate, setLastMessageDate] = useState();
  const [lastMessageSender, setLastMessageSender] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    let roomArr = [fetchU, name];
    let roomArrSorted = roomArr.sort();
    let stringArr = `${roomArrSorted[0]}${roomArrSorted[1]}`;

    firestore()
      .collection('users')
      .where('email', '==', name)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          setUserData(documentSnapshot._data);
        });

        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
      });

    const subscriber = firestore()
      .collection('rooms')
      .doc(`${stringArr}`)
      .onSnapshot((querySnapshot) => {
        setLastMessage(querySnapshot._data.lastMessage);
        setLastMessageDate(querySnapshot._data.lastMessageDate.seconds);
        setLastMessageSender(querySnapshot._data.lastMessageSender);
        setUnreadMessages(querySnapshot._data.unreadMessages);
      });

    let currentDate = new Date().getTime() / 1000;

    let seconds = currentDate - lastMessageDate;
    let years = seconds / 31536000;
    let months = seconds / 2592000;
    let days = seconds / 86400;
    let hours = seconds / 3600;
    let minutes = seconds / 60;

    setIntervalTime([years, months, days, hours, minutes, seconds]);

    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ChatDetail', {
          name: name,
          email: userData.email,
          lastMessageSender: lastMessageSender,
          username: userData.username,
        });
      }}
      style={styles.messageContainer}
    >
      <TouchableOpacity style={{ width: 60 }}>
        <Image
          style={darkEnabled ? styles.profilePicDark : styles.profilePic}
          source={
            userData
              ? { uri: userData.profilePic }
              : require('../assets/images/profilepic-test-8.png')
          }
        />
      </TouchableOpacity>
      <View style={{ width: 200 }}>
        <Text
          style={darkEnabled ? styles.messagePersonDark : styles.messagePerson}
        >
          {userData.username}
        </Text>
        <Text
          style={
            darkEnabled
              ? unreadMessages > 0 && lastMessageSender != fetchU
                ? styles.messageContentDarkUnread
                : styles.messageContentDark
              : unreadMessages > 0 && lastMessageSender != fetchU
              ? styles.messageContentUnread
              : styles.messageContent
          }
          numberOfLines={1}
        >
          {lastMessage}
        </Text>
      </View>
      <View style={{ flexDirection: 'column' }}>
        <Text style={darkEnabled ? styles.messageTimeDark : styles.messageTime}>
          {intervalTime[5] > 31536000
            ? `${Math.floor(intervalTime[0])}y ago`
            : intervalTime[5] > 2592000
            ? `${Math.floor(intervalTime[1])}m ago`
            : intervalTime[5] > 86400
            ? `${Math.floor(intervalTime[2])}d ago`
            : intervalTime[5] > 3600
            ? `${Math.floor(intervalTime[3])}h ago`
            : intervalTime[5] > 60
            ? `${Math.floor(intervalTime[4])}min ago`
            : 'Just Now'}
        </Text>

        {lastMessageSender != fetchU && unreadMessages != 0 ? (
          <View
            style={
              darkEnabled
                ? styles.newMessageCircleDark
                : styles.newMessageCircle
            }
          >
            <Text style={styles.newMessageNumber}>{unreadMessages}</Text>
          </View>
        ) : (
          false
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 40,
    paddingBottom: 40,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    alignItems: 'center',
  },

  profilePic: {
    width: 45,
    height: 45,
    borderRadius: 50,
    borderColor: '#1C1C98',
    borderWidth: 3,
    marginRight: 20,
    // tintColor: '#1C1C98',
    // opacity: 0.5,
  },

  profilePicDark: {
    width: 45,
    height: 45,
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 3,
    marginRight: 20,
  },

  messagePerson: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 2,
  },

  messagePersonDark: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 2,
  },

  messageContent: {
    color: '#999',
    fontFamily: 'OpenSans',
  },

  messageContentUnread: {
    color: '#777',
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
  },

  messageContentDark: {
    color: '#ddd',
    fontFamily: 'OpenSans',
  },

  messageContentDarkUnread: {
    color: '#ddd',
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
  },

  messageTime: {
    fontSize: 10,
    margin: 0,
    padding: 0,
    color: '#222',
  },

  messageTimeDark: {
    fontSize: 10,
    margin: 0,
    padding: 0,
    color: '#ddd',
  },

  newMessageCircle: {
    backgroundColor: '#ED6663',
    height: 20,
    width: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
    marginTop: 5,
  },

  newMessageCircleDark: {
    backgroundColor: '#ffa072',
    height: 20,
    width: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
    marginTop: 5,
  },

  newMessageNumber: {
    fontSize: 10,
    color: '#fff',
  },
});
