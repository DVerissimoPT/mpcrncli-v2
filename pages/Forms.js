import React, { useEffect, useContext, useState } from 'react';
import firestore, { firebase } from '@react-native-firebase/firestore';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import Info from '../components/Info';
import Form from '../components/Form';
import { GlobalContext } from '../context/Context';
import { sub } from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';

var widthThird = Dimensions.get('window').width / 3 - 20;

export default function Forms({ navigation }) {
  const { darkEnabled, userN, fetchU, userId } = useContext(GlobalContext);
  const { isBarVisible } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [forms, setForms] = useState([]);
  const [sharedForms, setSharedForms] = useState([]);
  const [mustUpdate, setMustUpdate] = useState(false);
  const [formMax, setFormMax] = useState(7);
  const [maxReached, setMaxReached] = useState(false);
  const { saveHostInfo } = useContext(GlobalContext);
  const { hostInformation } = useContext(GlobalContext);
  const [updateFlag, setUpdateFlag] = useState(true);

  const isFocused = useIsFocused();


  useEffect(() => {
   // console.log(firestore().doc('users/'+userId)._documentPath._parts[1]);
    if (isFocused == true) {
      console.log('update');
      let forms = [];
      let sharedForms = [];

      const subscriber = firestore()
        .collection('forms')
        .where('autor_ref', '==', `users/${userId}`)
        .orderBy('date', 'desc')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((documentSnapshot) => {
            console.log(documentSnapshot._data);
            if (documentSnapshot._data.shared) {
              sharedForms.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            } else {
              forms.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            }
          });

          setForms(forms);
          setSharedForms(sharedForms);
        });

      isBarVisible(true);
    }
  }, [isFocused, updateFlag]);

  const forceUpdate = () => {
    setUpdateFlag(!updateFlag);
  };

  if (loading) {
    return (
      <ActivityIndicator
        size='large'
        color={darkEnabled ? '#ffa072' : '#1C1C98'}
      />
    );
  }

  return (
    <ScrollView
      style={darkEnabled ? styles.formsContainerDark : styles.formsContainer}
    >
      <View style={styles.titleContainer}>
        <Text style={darkEnabled ? styles.myFormsDark : styles.myForms}>
          MY TEMPLATES
        </Text>
        <Info
          text='Here is where we keep your study forms. Create new forms to help you study.'
          size={125}
        />
      </View>

      <View style={styles.myFormsContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AddForm', { forms: forms });
          }}
          style={
            darkEnabled ? styles.addFormContainerDark : styles.addFormContainer
          }
        >
          <Image
            style={styles.addFormCross}
            source={
              darkEnabled
                ? require('../assets/images/form-cross-white-8.png')
                : require('../assets/images/form-cross-8.png')
            }
          />
        </TouchableOpacity>
        {forms.map((form, index) => {
          if (index >= formMax) {
            if (!maxReached) {
              setMaxReached(true);
            }
          } else {
            return (
              <Form
                navigation={navigation}
                name={form.nome}
                key={form.key}
                widthThird={widthThird}
                img={form.img}
                forceUpdate={forceUpdate}
              />
            );
          }
        })}

        {maxReached && forms.length - formMax > 0 ? (
          <TouchableOpacity
            onPress={() => {
              setFormMax(formMax + 3);
            }}
            style={
              darkEnabled
                ? styles.addFormContainerDark
                : styles.addFormContainer
            }
          >
            <Text style={darkEnabled ? styles.moreFormsDark : styles.moreForms}>
              {`+${forms.length - formMax}`}
            </Text>
          </TouchableOpacity>
        ) : (
          false
        )}

        {formMax > 10 ? (
          <TouchableOpacity
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
            }}
            onPress={() => {
              setFormMax(7);
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Nunito-Bold',
                color: '#1C1C98',
              }}
            >
              Hide Forms
            </Text>
          </TouchableOpacity>
        ) : (
          false
        )}
      </View>

      <View style={styles.titleContainer}>
        <Text style={darkEnabled ? styles.myFormsDark : styles.myForms}>
          SHARED WITH ME
        </Text>
        <Info
          text='Here you can see the forms your friends shared. You can use them to practice.'
          size={100}
        />
      </View>

      <View style={styles.myFormsContainer}>
        {sharedForms.length == 0 ? (
          <View
            style={{
              display: 'flex',
              width: '100%',
              height: '50%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'Nunito-Bold',
                color: '#ddd',
                fontSize: 18,
              }}
            >
              You have no shared templates yet
            </Text>
          </View>
        ) : (
          sharedForms.map((sharedForm) => (
            <Form
              navigation={navigation}
              name={sharedForm.nome}
              key={sharedForm.key}
              widthThird={widthThird}
              img={sharedForm.img}
              forceUpdate={forceUpdate}
              shared={true}
              autor={sharedForm.autor}
            />
          ))
        )}

        {/* <TouchableOpacity
          style={
            darkEnabled ? styles.addFormContainerDark : styles.addFormContainer
          }
        >
          <Text style={darkEnabled ? styles.moreFormsDark : styles.moreForms}>
            +3
          </Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  formsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },

  formsContainerDark: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  myFormsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 40,
  },

  myForms: {
    fontSize: 18,
    color: '#1C1C98',
    fontFamily: 'Nunito-SemiBold',
  },

  myFormsDark: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Nunito-SemiBold',
  },

  addFormContainer: {
    width: widthThird,
    height: widthThird,
    padding: 15,
    borderColor: '#1C1C98',
    borderWidth: 3,
    borderRadius: 20,
    marginRight: 3,
    marginLeft: 3,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addFormContainerDark: {
    width: widthThird,
    height: widthThird,
    padding: 15,
    borderColor: '#fff',
    borderWidth: 3,
    borderRadius: 20,
    marginRight: 3,
    marginLeft: 3,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addFormCross: {
    width: '100%',
    height: '100%',
  },

  moreForms: {
    fontSize: 30,
    color: '#1C1C98',
    fontFamily: 'Nunito-SemiBold',
  },

  moreFormsDark: {
    fontSize: 30,
    color: '#fff',
    fontFamily: 'Nunito-SemiBold',
  },
});
