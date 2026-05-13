import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import EditProfile from '../pages/EditProfile';
import Message from './Message';
import firestore, { firebase } from '@react-native-firebase/firestore';
// import { globalStyles } from "../styles/GlobalStyles";
import { useIsFocused } from '@react-navigation/native';

import { GlobalContext } from '../context/Context';
import { last } from 'lodash';

export default function Messages({ navigation }) {
  const { darkEnabled, fetchU, isBarVisible } = useContext(GlobalContext);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastMessages, setLastMessages] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused == true) {
      isBarVisible(true);

      setUsersData([]);

      firestore()
        .collection('rooms')
        .orderBy('lastMessageDate', 'desc')
        .get()
        .then((querySnapshot) => {
          let data = [];
          querySnapshot.forEach((documentSnapshot) => {
            if (documentSnapshot._data.participants.includes(fetchU)) {
              console.log(documentSnapshot._data);
              let lastMessageDate =
                documentSnapshot._data.lastMessageDate._seconds;

              documentSnapshot._data.participants.forEach((participant) => {
                if (participant != fetchU) {
                  data.push([participant, lastMessageDate]);
                }
              });
            }
          });

          setUsersData(data.sort((a) => a[1]));

          setLoading(false);
        });
    }
  }, [isFocused]);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (usersData.length == 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 15 }}>
          You haven't started a conversation yet!
        </Text>
      </View>
    );
  } else {
    return (
      <ScrollView
        style={
          darkEnabled ? styles.messagesContainerDark : styles.messagesContainer
        }
      >
        {usersData.map((user, i) => (
          <Message navigation={navigation} name={user[0]} key={i} />
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  messagesContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ffffff',
  },

  messagesContainerDark: {
    flex: 1,
    width: '100%',
    backgroundColor: '#1a1a1a',
  },
});
