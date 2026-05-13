import React, { useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { GlobalContext } from '../context/Context';

export default function People({ name, navigation, email,profilePic }) {
  const { darkEnabled } = useContext(GlobalContext);

  return (
    <TouchableOpacity
      style={darkEnabled ? styles.peopleContentDark : styles.peopleContent}
      onPress={() => {
        navigation.navigate('ChatDetail', { name: name, email: email });
      }}
    >
      <TouchableOpacity style={{ width: 60 }}>
        <Image
          style={darkEnabled ? styles.profilePicDark : styles.profilePic}
          source={{uri:profilePic}}
        />
        <View style={styles.online} />
      </TouchableOpacity>
      <Text style={darkEnabled ? styles.peopleNameDark : styles.peopleName}>
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  peopleContent: {
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
    backgroundColor:"#fff",
  },

  peopleContentDark: {
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
  },

  profilePicDark: {
    width: 45,
    height: 45,
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 3,
    marginRight: 20,
  },

  online: {
    width: 15,
    height: 15,
    borderRadius: 50,
    backgroundColor: '#88c23f',
    position: 'absolute',
    bottom: 0,
    right: 15,
  },

  peopleName: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'Nunito-SemiBold',
  },

  peopleNameDark: {
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'Nunito-SemiBold',
  },
});
