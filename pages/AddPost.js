import React, { useContext, useEffect, useState } from 'react';
import firestore, { firebase } from '@react-native-firebase/firestore';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { GlobalContext } from '../context/Context';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

export default function AddPost() {
  const navigation = useNavigation();
  const { darkEnabled } = useContext(GlobalContext);
  const { isBarVisible } = useContext(GlobalContext);
  const [postContent, setPostContent] = useState('');
  const { fetchU } = useContext(GlobalContext);
  const [postImages, setPostImages] = useState([]);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    isBarVisible(false);
    return function cleanup() {
      isBarVisible(true);
    };
  });

  const addPost = (text) => {
    //text = post.
    setLoading(true);
    let username = '';
    let ref_user = '';
    firestore()
      .collection('users')
      .where('email', '==', fetchU)
      .get()
      .then(function(querySnapshot) {
        const userName = [];

        querySnapshot.forEach((documentSnapshot) => {
          userName.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        ref_user = 'users/' + userName[0]['key'];
        username = userName[0]['username'];

        if (postImages.length == 0) {
          let data = {
            autor: username,
            post: text,
            ref_user: firestore().doc(ref_user),
            data_post: firebase.firestore.Timestamp.now(),
            media: [],
            likes: [],
          };

          firestore()
            .collection('posts')
            .add(data)
            .then(() => {
              setLoading(false);
              navigation.navigate('Feed');
            });
        } else {
          if (postImages.length > 1) {
            const reference = firebase.storage().ref();
            let url_array = [];
            // reference.putFile(image.path).then(async () => {
            //   let url = await reference.getDownloadURL();
            //   setImageUrl(url);
            // });
            postImages.forEach((v, i) => {
              let task = reference
                .child(
                  'images/' +
                    userName[0]['key'] +
                    Math.floor(Math.random() * 99999999) +
                    '.jpg'
                )
                .putFile(v['path'])
                .then(async (ss) => {
                  await storage()
                    .ref(ss.metadata.fullPath)
                    .getDownloadURL()
                    .then((url) => {
                      if (ss.metadata.contentType.includes('image')) {
                        url_array.push({ uri: url, type: 'image' });
                      } else {
                        url_array.push({ uri: url, type: 'video' });
                      }
                      if (i == postImages.length - 1) {
                        let data = {
                          autor: username,
                          post: text,
                          ref_user: firestore().doc(ref_user),
                          data_post: firebase.firestore.Timestamp.now(),
                          media: [...url_array],
                          likes: [],
                        };
                        firestore()
                          .collection('posts')
                          .add(data)
                          .then(() => {
                            setLoading(false);
                            navigation.navigate('Feed');
                          });
                      }
                    });
                });
            });
          } else {
            const reference = firebase.storage().ref();
            let task = reference
              .child(
                'images/' +
                  userName[0]['key'] +
                  Math.floor(Math.random() * 99999999) +
                  '.jpg'
              )
              .putFile(postImages[0]['path'])
              .then(async (ss) => {
                await storage()
                  .ref(ss.metadata.fullPath)
                  .getDownloadURL()
                  .then((url) => {
                    let obj_media = null;
                    if (ss.metadata.contentType.includes('image')) {
                      obj_media = { uri: url, type: 'image' };
                    } else {
                      obj_media = { uri: url, type: 'video' };
                    }
                    let data = {
                      autor: username,
                      post: text,
                      ref_user: firestore().doc(ref_user),
                      data_post: firebase.firestore.Timestamp.now(),
                      media: [obj_media],
                      likes: [],
                    };
                    firestore()
                      .collection('posts')
                      .add(data)
                      .then(() => {
                        setLoading(false);
                        navigation.navigate('Feed');
                      });
                  });
              });
          }
        }
      });
  };

  const insertMultImage = () => {
    ImagePicker.openPicker({
      multiple: true,
    }).then((images) => {
      if (images.length > 4) {
        console.log('demasiadas fotos');
      } else {
        setPostImages(images);
      }
    });
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: false,
    }).then((image) => {
      setPostImages([image]);
    });
  };

  const recCamera = () => {
    ImagePicker.openCamera({
      mediaType: 'video',
    }).then((image) => {
      setPostImages([image]);
    });
  };

  if(loading){
    return <ActivityIndicator> 
    </ActivityIndicator>
  }

  return (
    <View style={styles.addPostContainer}>
      <View style={darkEnabled ? styles.postNavDark : styles.postNav}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.goBackIconContainer}
        >
          <Image
            style={styles.goBackIcon}
            source={require('../assets/images/goback-icon-8.png')}
          />
        </TouchableOpacity>
        <Text style={styles.navTitle}>CREATE POST</Text>
      </View>
      <View
        style={
          darkEnabled
            ? styles.postInputContainerDark
            : styles.postInputContainer
        }
      >
        <TextInput
          onChangeText={(text) => {
            setPostContent(text);
          }}
          style={
            darkEnabled
              ? [styles.postInput, { color: '#fff' }]
              : styles.postInput
          }
          placeholder="What's going on?"
          placeholderTextColor={darkEnabled ? '#f0f0f0' : '#000'}
          multiline
          numberOfLines={8}
          maxLength={280}
          clearButtonMode='always'
        />

        <View style={[styles.row, { marginTop: 10 }]}>
          {postImages.map((image) => (
            <TouchableOpacity
              style={
                darkEnabled
                  ? {
                      width: 75,
                      height: 75,
                      borderWidth: 2,
                      borderColor: '#ff9f72',
                      borderRadius: 10,
                      marginRight: 5,
                    }
                  : {
                      width: 75,
                      height: 75,
                      borderWidth: 2,
                      borderColor: '#1C1C98',
                      borderRadius: 10,
                      marginRight: 5,
                    }
              }
            >
              <Image
                style={{ width: '100%', height: '100%', borderRadius: 7 }}
                source={{ uri: image.path }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={darkEnabled ? styles.bottomBarDark : styles.bottomBar}>
        <View style={styles.row}>
          {/* <TouchableOpacity onPress={recCamera}>
            <Image
              style={darkEnabled ? styles.openCameraDark : styles.openCamera}
              source={require('../assets/images/rec-camera-8.png')}
            />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={openCamera}>
            <Image
              style={darkEnabled ? styles.openCameraDark : styles.openCamera}
              source={require('../assets/images/open-camera-8.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={insertMultImage}>
            <Image
              style={darkEnabled ? styles.insertImageDark : styles.insertImage}
              source={require('../assets/images/insert-image-8.png')}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => addPost(postContent)}
          style={darkEnabled ? styles.shareBtnDark : styles.shareBtn}
        >
          <Text style={styles.shareBtnText}>SHARE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addPostContainer: {
    height: '100%',
  },

  row: {
    flexDirection: 'row',
  },

  insertImage: {
    width: 33,
    height: 24,
    marginRight: 20,
  },

  insertImageDark: {
    tintColor: '#ffa072',
    width: 33,
    height: 24,
    marginRight: 20,
  },

  openCamera: {
    width: 30,
    height: 24,
    marginRight: 20,
  },

  openCameraDark: {
    width: 30,
    height: 24,
    marginRight: 20,
    tintColor: '#ffa072',
  },

  postNav: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#1C1C98',
    alignItems: 'center',
    justifyContent: 'center',
  },

  postNavDark: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#ff9f72',
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

  navTitle: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingRight: 15,
  },

  postInput: {
    fontSize: 16,
    textAlignVertical: 'top',
  },

  postInputContainer: {
    padding: 20,
    height: '100%',
    backgroundColor: '#fff',
  },

  postInputContainerDark: {
    padding: 20,
    height: '100%',
    backgroundColor: '#1a1a1a',
  },

  bottomBar: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    height: 70,
    width: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },

  bottomBarDark: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    height: 70,
    width: '100%',
    backgroundColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },

  shareBtn: {
    width: 100,
    height: 45,
    borderRadius: 50,
    backgroundColor: '#1C1C98',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },

  shareBtnDark: {
    width: 100,
    height: 45,
    borderRadius: 50,
    backgroundColor: '#ff9f72',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },

  shareBtnText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
  },
});
