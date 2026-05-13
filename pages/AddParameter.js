import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { GlobalContext } from '../context/Context';
import { auto } from 'async';
import ImagePicker from 'react-native-image-crop-picker';
import firestore, { firebase } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export default function AddParameter({ navigation, route }) {
  const { darkEnabled, userId } = useContext(GlobalContext);
  const [parameterName, setParameterName] = useState('');
  const [parameterDescription, setParameterDescription] = useState('');
  const [parameterImage, setParameterImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState('');

  const addParameter = () => {
    if (parameterName == '' || !parameterName) {
      setError('Insert a valid parameter name');

      return;
    }

    if (route.params.numberOfParams >= 20) {
      setError('Max number of parameters reached');

      return;
    }

    if (parameterImage) {
      let reference = storage().ref(
        `images/${Math.random()
          .toString(36)
          .substring(2, 15) +
          Math.random()
            .toString(36)
            .substring(2, 15)}.jpg`
      );

      reference.putFile(parameterImage).then(async () => {
        let url = await reference.getDownloadURL();
        console.log(url);
        setImageUrl(url);
      });
    } else {
      setImageUrl('');
    }
  };

  useEffect(() => {
    if (imageUrl != null) {
      firestore()
        .collection('parameters')
        .where('autor_ref', '==', `users/${userId}`)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((documentSnapshot) => {
            firestore()
              .collection('parameters')
              .doc(documentSnapshot.id)
              .update({
                parameters: [
                  ...route.params.params,
                  {
                    name: parameterName,
                    image: imageUrl,
                    description: parameterDescription,
                  },
                ],
              })
              .then(() => {
                console.log('parameter para a db, toma q já engoliste');
              });
          });

          navigation.goBack();
        });
    }
  }, [imageUrl]);

  const handleImagePicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then((image) => {
      setParameterImage(image.path);
    });
  };

  return (
    <ScrollView style={styles.addParameterContainer}>
      {/* header */}
      <View
        style={
          darkEnabled ? styles.addParameterNavDark : styles.addParameterNav
        }
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.goBackIconContainer}
        >
          <Image
            style={styles.goBackIcon}
            source={require('../assets/images/goback-icon-8.png')}
          />
        </TouchableOpacity>
        <Text style={styles.navTitle}>ADD NEW PARAMETER</Text>
      </View>
      <View
        style={
          darkEnabled
            ? styles.addParameterContentDark
            : styles.addParameterContent
        }
      >
        <View style={{ width: '100%', marginBottom: 25 }}>
          <Text style={darkEnabled ? styles.formTitlesDark : styles.formTitles}>
            Parameter Name
          </Text>
          <TextInput
            onChangeText={(text) => {
              setError('');
              setParameterName(text);
            }}
            maxLength={30}
            placeholder='Ex: Posture'
            placeholderTextColor='#ddd'
            style={darkEnabled ? styles.formInputDark : styles.formInput}
          />

          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
        <View style={{ width: '100%', marginBottom: 25 }}>
          <Text style={darkEnabled ? styles.formTitlesDark : styles.formTitles}>
            Parameter Description
          </Text>
          <Text style={styles.formComment}>Optional</Text>
          <TextInput
            onChangeText={(text) => {
              setParameterDescription(text);
            }}
            placeholder='Ex: Posture'
            placeholderTextColor='#ddd'
            style={darkEnabled ? styles.formInputDark : styles.formInput}
          />
        </View>

        <View style={{ width: '100%', marginBottom: 0 }}>
          <Text style={darkEnabled ? styles.formTitlesDark : styles.formTitles}>
            Image
          </Text>
          <Text style={styles.formComment}>Optional</Text>
          <TouchableOpacity
            onPress={handleImagePicker}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 320,
              height: 320,
              borderRadius: 20,
              marginRight: 3,
              marginLeft: 3,
              marginBottom: 6,
              marginTop: 10,
            }}
          >
            <ImageBackground
              imageStyle={{ borderRadius: 17 }}
              source={
                parameterImage
                  ? { uri: parameterImage }
                  : require('../assets/images/piano-8.png')
              }
              style={styles.formImage}
            />
            <View
              style={
                darkEnabled
                  ? styles.overlayDarkSelected
                  : styles.overlaySelected
              }
            >
              <Image
                style={styles.photoIcon}
                source={require('../assets/images/upload-profile-picture.png')}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ width: '40%', marginBottom: 50 }}>
          <TouchableOpacity
            style={darkEnabled ? styles.btnSaveDark : styles.btnSave}
            onPress={addParameter}
          >
            <Text style={styles.btnText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addParameterContainer: {
    flex: 1,
  },

  addParameterNav: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#1C1C98',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addParameterNavDark: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#ffa072',
    alignItems: 'center',
    justifyContent: 'center',
  },

  navTitle: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingRight: 15,
  },

  goBackIconContainer: {
    marginLeft: 15,
  },

  goBackIcon: {
    width: 15,
    height: 30,
  },

  addParameterContent: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
  },

  addParameterContentDark: {
    backgroundColor: '#1a1a1a',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
  },

  formTitles: {
    fontSize: 20,
    color: '#1C1C98',
    fontFamily: 'Nunito-SemiBold',
    alignSelf: 'flex-start',
  },

  formTitlesDark: {
    fontSize: 20,
    color: '#ffa072',
    fontFamily: 'Nunito-SemiBold',
    alignSelf: 'flex-start',
  },

  formInput: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#1C1C98',
    width: '100%',
    color: '#000',
  },

  formInputDark: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#ffa072',
    width: '100%',
    color: '#fff',
  },

  formComment: {
    color: '#bbb',
    fontSize: 15,
    fontStyle: 'italic',
  },

  formCommentDark: {
    color: '#ddd',
    fontSize: 15,
    fontStyle: 'italic',
  },

  btnText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
  },

  btnSave: {
    color: '#fff',
    backgroundColor: '#1c1c98',
    padding: 13,
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 30,
  },

  btnSaveDark: {
    color: '#fff',
    backgroundColor: '#ffa072',
    padding: 13,
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 30,
  },

  formImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  overlaySelected: {
    position: 'absolute',
    backgroundColor: '#1C1C98',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    opacity: 0.5,
  },

  overlayDarkSelected: {
    position: 'absolute',
    backgroundColor: '#ffa072',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    opacity: 0.5,
  },

  photoIcon: {
    zIndex: 11,
    position: 'absolute',
    height: 50,
    width: 50,
    top: '40%',
    left: '42%',
  },
});
