import React, { useContext, useEffect, useState } from 'react';
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

export default function Form({
  widthThird,
  name,
  shared,
  navigation,
  img,
  forceUpdate,
  chatShare,
  roomId,
  userImg,
  autor,
  closeOverlay,
}) {
  const { darkEnabled, toggleStudyMode, userId, fetchU } = useContext(
    GlobalContext
  );
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [sharedUserId, setSharedUserId] = useState('');

  useEffect(() => {
    if (shared) {
      firestore()
        .collection('users')
        .where('email', '==', autor)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((documentSnapshot) => {
            setSharedUserId(documentSnapshot.id);
            setProfilePic(documentSnapshot._data.profilePic);
          });
        });
    }
  }, []);

  const deleteForm = () => {
    firestore()
      .collection('forms')
      .where('author_name', '==', `${name}${userId}`)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          firestore()
            .collection('forms')
            .doc(documentSnapshot.id)
            .delete()
            .then(() => {
              forceUpdate();
              setOverlayVisible(false);
            });
        });
      });
  };

  const shareFormOnChat = (room) => {
    let id = `${Math.floor(Math.random() * 99999)}-${Math.floor(
      Math.random() * 99999
    )}-${Math.floor(Math.random() * 99999)}-${Math.floor(
      Math.random() * 99999
    )}-${Math.floor(Math.random() * 99999)}`;

    firestore()
      .collection('rooms')
      .doc(room)
      .collection('messages')
      .doc(id)
      .set({
        message: [
          {
            _id: id,
            createdAt: new Date(),
            text: 'Add to Library',
            user: {
              _id: userId,
              name: 'Ema Bonito',
              avatar: userImg,
            },
            name: fetchU,
            real: true,
            system: false,
            isForm: true,
            quickReplies: {
              type: 'radio',
              keepIt: true,
              values: [
                {
                  title: 'Add template to Library',
                  value: 'add_to_library',
                },
              ],
            },
            form: {
              name: name,
              author_name: `${name}${userId}`,
              img: img
                ? img
                : 'https://firebasestorage.googleapis.com/v0/b/mpcrn-2fe0c.appspot.com/o/images%2Fpiano-8.png?alt=media&token=2dc2955b-fe25-4ae1-9842-a6f1e5397e19',
            },
          },
        ],
      })
      .then(() => {
        firestore()
          .collection('rooms')
          .doc(`${room}`)
          .update({
            lastMessageSender: fetchU,
            lastMessage: `Template ${name}`,
            lastMessageDate: new Date(),
            unreadMessages: firestore.FieldValue.increment(1),
          })
          .then(() => {
            closeOverlay();
          });
      });
  };

  return (
    <TouchableOpacity
      onPress={() => {
        if (chatShare) {
          shareFormOnChat(roomId);
        } else {
          if (shared) {
            toggleStudyMode(name, userId, sharedUserId);
          } else {
            toggleStudyMode(name, userId, null);
          }
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
          onPress={deleteForm}
          style={{
            height: 50,
            width: 180,
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
            Delete Form
          </Text>
        </TouchableOpacity>
      </Overlay>

      <ImageBackground
        imageStyle={{ borderRadius: 17 }}
        source={img ? { uri: img } : require('../assets/images/piano-8.png')}
        style={styles.formImage}
      />

      <View style={darkEnabled ? styles.overlayDark : styles.overlay} />

      {shared ? (
        <Image
          style={styles.sharedProfile}
          source={
            profilePic
              ? { uri: profilePic }
              : require('../assets/images/ema-8.png')
          }
        />
      ) : (
        <View />
      )}

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

  overlay: {
    position: 'absolute',
    backgroundColor: '#1C1C98',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    opacity: 0.5,
  },

  overlayDark: {
    position: 'absolute',
    backgroundColor: '#1A1A1A',
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
