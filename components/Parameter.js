import React, { useContext, useState } from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  Text,
  View,
} from 'react-native';
import { GlobalContext } from '../context/Context';
import { Overlay } from 'react-native-elements';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { auto } from 'async';

export default function Parameter({
  widthThird,
  name,
  addParameters,
  image,
  toggleFetch,
}) {
  const { darkEnabled, userId } = useContext(GlobalContext);
  const [paramSelected, setParamSelected] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const deleteParameter = () => {
    firestore()
      .collection('parameters')
      .where('autor_ref', '==', `users/${userId}`)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
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
                    parameters: documentSnapshot._data.parameters.filter(
                      (param) => param.name != name
                    ),
                  })
                  .then(() => {
                    toggleFetch();
                    setOverlayVisible(false);
                  });
              });
            });
        });
      });
  };

  return (
    <TouchableOpacity
      onPress={() => {
        if (paramSelected) {
          addParameters(name, 'remove');
          setParamSelected(false);
        } else {
          addParameters(name, 'add');
          setParamSelected(true);
        }
      }}
      onLongPress={() => {
        setOverlayVisible(true);
      }}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: widthThird,
        height: widthThird,
        borderRadius: 20,
        marginRight: 3,
        marginLeft: 3,
        marginBottom: 6,
      }}
    >
      <Overlay
        onBackdropPress={() => {
          setOverlayVisible(false);
        }}
        isVisible={overlayVisible}
        overlayStyle={{ margin: 0, padding: 0, backgroundColor: '#ed6663' }}
      >
        <TouchableOpacity
          onPress={deleteParameter}
          style={{
            height: 50,
            width: 190,
            padding: 10,
            margin: 0,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../assets/images/trash.png')}
            style={{ height: 20, width: 16, marginRight: 5 }}
          />
          <Text style={{ fontFamily: 'Nunito', color: '#fff', fontSize: 18 }}>
            Delete Parameter
          </Text>
        </TouchableOpacity>
      </Overlay>

      <ImageBackground
        imageStyle={{ borderRadius: 17 }}
        source={
          image == ''
            ? {
                uri:
                  'https://images.unsplash.com/photo-1552422535-c45813c61732?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
              }
            : { uri: image }
        }
        style={styles.formImage}
      />

      <View
        style={
          darkEnabled
            ? paramSelected
              ? styles.overlayDarkSelected
              : styles.overlayDark
            : paramSelected
            ? styles.overlaySelected
            : styles.overlay
        }
      />

      <Text style={styles.formName}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  formImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sharedProfile: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderRadius: 100,
    top: -3,
    right: -3,
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

  overlay: {
    position: 'absolute',
    backgroundColor: '#c8c8c8',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    opacity: 0.9,
  },

  overlayDark: {
    position: 'absolute',
    backgroundColor: '#333',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    opacity: 0.9,
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

  formName: {
    position: 'absolute',
    color: '#fff',
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
    padding: 3,
    fontFamily: 'Nunito-Bold',
  },
});
