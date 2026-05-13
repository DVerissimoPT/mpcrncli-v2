import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import EditProfile from './EditProfile';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { GlobalContext } from '../context/Context';
import Person from '../components/Person';
import { useIsFocused } from '@react-navigation/native';

export default function People({ navigation }) {
  const { darkEnabled, fetchU, isBarVisible } = useContext(GlobalContext);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused == true) {
      isBarVisible(true);

      let data = [];
      let followers = [];
      let email = fetchU;
      firestore()
        .collection('users')
        .where('email', '==', email)
        .get()
        .then((qs) => {
          qs.forEach((ds) => {
            /*get followers*/
            console.log(ds._data);
            followers = ds.data().following;
            if (followers) {
              followers.forEach((v, i) => {
                let doc = firestore().doc('users/' + v);
                doc.get().then((qs) => {
                  console.log('got data');
                  data.push(qs.data());
                  setUsersData(data);
                  setLoading(false);
                });
              });
            } else {
              console.log('no followers');
              setLoading(false);
            }
          });
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  }, [isFocused]);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View
      style={darkEnabled ? styles.peopleContainerDark : styles.peopleContainer}
    >
      <FlatList
        data={usersData}
        renderItem={({ item }) => (
          <Person
            navigation={navigation}
            email={item.email}
            name={item.username}
            profilePic={item.profilePic}
            key={Math.floor(Math.random() * 999999)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  peopleContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ffffff',
  },

  peopleContainerDark: {
    flex: 1,
    width: '100%',
    backgroundColor: '#1a1a1a',
  },
});
