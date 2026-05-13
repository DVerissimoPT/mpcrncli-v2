import React, { useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { GlobalContext } from '../context/Context';
import Form from '../components/Form';

var widthThird = Dimensions.get('window').width / 3 - 20;

export default function SearchPeople({ navigation }) {
  const { darkEnabled } = useContext(GlobalContext);

  return (
    <View
      style={darkEnabled ? styles.searchContainerDark : styles.searchContainer}
    >
      {/* header */}
      <View style={darkEnabled ? styles.searchNavDark : styles.searchNav}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.goBackIconContainer}
        >
          <Image
            style={styles.goBackIcon}
            source={require('../assets/images/goback-icon-8.png')}
          />
        </TouchableOpacity>
        <TextInput
          placeholder='Search for study forms'
          placeholderTextColor='#eee'
          style={darkEnabled ? styles.searchBarDark : styles.searchBar}
        />
      </View>
      <ScrollView>
        <View style={styles.myFormsContainer}>
          <Form
            style={styles.form}
            name='Posture'
            shared={false}
            widthThird={widthThird}
          />
          <Form name='Violin' shared={false} widthThird={widthThird} />
          <Form
            name='Breathing Trumpet'
            shared={false}
            widthThird={widthThird}
          />
          <Form name='Left Hand Guitar' shared={true} widthThird={widthThird} />
          <Form name='Piano' shared={false} widthThird={widthThird} />
          <Form name='Teacher Pedro' shared={true} widthThird={widthThird} />

          <Form name='Teacher Pedro' shared={true} widthThird={widthThird} />
          <Form name='Teacher Pedro' shared={true} widthThird={widthThird} />
          <Form name='Teacher Pedro' shared={true} widthThird={widthThird} />
          <Form name='Teacher Pedro' shared={true} widthThird={widthThird} />
          <Form name='Teacher Pedro' shared={true} widthThird={widthThird} />
          <Form name='Teacher Pedro' shared={true} widthThird={widthThird} />
          <Form name='Teacher Pedro' shared={true} widthThird={widthThird} />
          <Form name='Teacher Pedro' shared={true} widthThird={widthThird} />
          <Form name='Teacher Pedro' shared={true} widthThird={widthThird} />
          <Form name='Teacher Pedro' shared={true} widthThird={widthThird} />
          <Form name='Teacher Pedro' shared={true} widthThird={widthThird} />
          <Form name='Teacher Pedro' shared={true} widthThird={widthThird} />
          <Form name='Teacher Pedro' shared={true} widthThird={widthThird} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  searchContainerDark: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },

  searchNav: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#1C1C98',
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchNavDark: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#ffa072',
    alignItems: 'center',
    justifyContent: 'center',
  },

  goBackIconContainer: {
    marginLeft: 15,
  },

  goBackIcon: {
    width: 15,
    height: 30,
  },

  searchBar: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#ddd',
    width: '70%',
    color: '#fff',
    marginLeft: 30,
    marginRight: 30,
    padding: 10,
    paddingBottom: 2,
  },

  searchBarDark: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#fff',
    width: '70%',
    color: '#fff',
    marginLeft: 30,
    marginRight: 30,
    padding: 10,
    paddingBottom: 2,
  },

  myFormsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 40,
    marginTop: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  form: {
    margin: 200,
  },
});
