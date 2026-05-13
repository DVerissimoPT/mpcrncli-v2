import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { GlobalContext } from '../context/Context';
import ImageView from 'react-native-image-viewing';
import { globalStyles } from '../styles/GlobalStyles';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Comment from '../components/Comment';
import firestore, { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import * as glb from '../scripts/global.js';
const moment = require('moment');

export default function Chat({ route }) {
  const navigation = useNavigation();
  const { darkEnabled } = useContext(GlobalContext);
  const { fetchUserId } = useContext(GlobalContext);
  const { fetchU } = useContext(GlobalContext);
  const { isBarVisible } = useContext(GlobalContext);
  const {
    ref_post,
    autor,
    post,
    data_post,
    ref_user,
    media,
    likes,
    isCommentTable,
    key_id,
    host_id,
    profilePic,
  } = route.params;
  const [loading, setLoading] = useState(true);
  const [fetchPosts, setfetchPosts] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(false);
  let date = new moment(new Date(data_post));
  const [reply, setReply] = useState('');
  let parent_post = null;
  // let parent_post_dir = '';
  const [email, setEmail] = useState('');
  const [visible, setIsVisible] = useState(false);
  const [parent_post_dir, setParentPostDir] = useState('');

  const addLiked = () => {
    let uid = fetchUserId();
    let exists = likes.includes(uid);
    if (!exists) {
      likes.push(uid);
      firestore()
        .doc('posts/' + key_id)
        .update({ likes: likes });
      glb.addNotification(
        host_id,
        ref_user._documentPath._parts[1],
        key_id,
        'like'
      );
    } else {
      likes.splice(likes.indexOf(uid), 1);
      firestore()
        .doc('posts/' + key_id)
        .update({ likes: likes });
    }
  };

  useEffect(() => {
    console.log(media);

    console.log(ref_post);

    if (loading) {
      setEmail(fetchU);
    }
    if (isCommentTable) {
      parent_post = firestore().doc('comments/' + ref_post);
      setParentPostDir('comments/' + ref_post);
    } else {
      parent_post = firestore().doc('posts/' + ref_post);
      setParentPostDir('posts/' + ref_post);
    }

    firestore()
      .collection('comments')
      .where('ref_parent', '==', parent_post)
      .get()
      .then((qs) => {
        const comments = [];
        qs.forEach((ss) => {
          comments.push({
            ...ss.data(),
            key: ss.id,
          });
        });
        setfetchPosts(comments.sort((a, b) => a.data_post < b.data_post));
        setLoading(false);
      })
      .catch((e) => console.log(e));

    isBarVisible(false);
    return function cleanup() {
      isBarVisible(true);
    };
  }, [forceUpdate]);

  const postReply = () => {
    console.log('@@@', parent_post_dir);
    let data_obj = {
      autor: '',
      data_post: firebase.firestore.Timestamp.now(),
      likes: [],
      media: [],
      post: reply,
      ref_parent: firestore().doc(parent_post_dir),
      ref_user: '',
      replies: [],
    };

    firestore()
      .collection('users')
      .where('email', '==', email)
      .get()
      .then((qs) => {
        qs.forEach((ss) => {
          data_obj.autor = ss.data().username;
          data_obj.ref_user = firestore().doc('users/' + ss.id);
        });
      })
      .then(() => {
        firestore()
          .collection('comments')
          .add(data_obj)
          .then(() => {
            //success
            glb.addNotification(
              host_id,
              ref_user._documentPath._parts[1],
              key_id,
              'comment'
            );

            setForceUpdate(!forceUpdate);
          });
      });

    Keyboard.dismiss();
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator
          size='large'
          color={darkEnabled ? '#ffa072' : '#1C1C98'}
        />
      </View>
    );
  }

  return (
    <View
      style={
        darkEnabled
          ? styles.postDetailsContainerDark
          : styles.postDetailsContainer
      }
    >
      <ImageView
        visible={visible}
        images={media}
        imageIndex={0}
        onRequestClose={() => setIsVisible(false)}
      />

      <ScrollView>
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
          <Text style={styles.navTitle}>POST</Text>
        </View>

        <View style={styles.postContainer}>
          <View style={styles.postDetailsInfo}>
            <Image
              style={
                darkEnabled
                  ? styles.authorProfilePicDark
                  : styles.authorProfilePic
              }
              source={
                profilePic
                  ? { uri: profilePic }
                  : require('../assets/images/ema-8.png')
              }
            />
            <View style={styles.profileNameContainer}>
              <Text
                style={
                  darkEnabled ? styles.profileNameDark : styles.profileName
                }
              >
                {autor}
              </Text>
              <Text style={styles.at}>@emabonito223</Text>
            </View>
            <Image
              style={styles.postOptions}
              source={require('../assets/images/post-options-8.png')}
            />
          </View>
          <Text style={darkEnabled ? styles.postTextDark : styles.postText}>
            {post}
          </Text>

          {media.length > 0 ? (
            <TouchableOpacity
              onPress={() => {
                setIsVisible(true);
              }}
              style={{
                padding: 20,
                width: '100%',
                height: 300,
                borderRadius: 20,
              }}
            >
              <Image
                style={{ width: '100%', height: '100%', borderRadius: 10 }}
                source={{ uri: media[0].uri }}
              />
            </TouchableOpacity>
          ) : (
            false
          )}

          <View style={styles.postTime}>
            <Text style={styles.hours} />
            <Text style={styles.hours}>
              {date.format('MMMM Do YYYY, h:mm a')}
            </Text>
            <Text style={styles.date} />
          </View>
        </View>

        <View style={styles.likeAndShareContainer} />
        <View>
          {fetchPosts.map((d, i) => {
            return <Comment comments={fetchPosts[i]} key_id={ref_post} />;
          })}
        </View>
      </ScrollView>

      <View
        style={
          darkEnabled
            ? styles.commentInputContainerDark
            : styles.commentInputContainer
        }
      >
        <TextInput
          placeholder='Write your reply'
          placeholderTextColor='#C9C9C9'
          style={darkEnabled ? styles.commentInputDark : styles.commentInput}
          onChangeText={(text) => {
            setReply(text);
          }}
        />
        <View style={styles.bottomRowReply}>
          <View style={styles.gifAttachContainer}>
            <TouchableOpacity>
              <Image
                style={styles.attachmentIcon}
                source={
                  darkEnabled
                    ? require('../assets/images/anexo-dark-8.png')
                    : require('../assets/images/anexo-8.png')
                }
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                style={styles.gifIcon}
                source={
                  darkEnabled
                    ? require('../assets/images/gif-btn-dark-8.png')
                    : require('../assets/images/gif-btn-8.png')
                }
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={darkEnabled ? styles.replyButtonDark : styles.replyButton}
            onPress={postReply}
          >
            <Text style={styles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  postDetailsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 100,
  },

  postDetailsContainerDark: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingBottom: 100,
  },

  postContainer: {
    borderBottomColor: '#C9C9C9',
    borderBottomWidth: 1,
    paddingBottom: 20,
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
    backgroundColor: '#1A1A1A',
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

  postDetailsInfo: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },

  profileName: {
    fontSize: 23,
    color: '#1C1C98',
    fontFamily: 'Nunito-Bold',
  },

  profileNameDark: {
    fontSize: 23,
    color: '#FFA072',
    fontFamily: 'Nunito-Bold',
  },

  profileNameContainer: {
    marginLeft: 10,
  },

  at: {
    color: '#808080',
    fontFamily: 'OpenSans-Regular',
  },

  authorProfilePic: {
    width: 60,
    height: 60,
    borderRadius: 100,
    borderColor: '#1C1C98',
    borderWidth: 5,
  },

  authorProfilePicDark: {
    width: 60,
    height: 60,
    borderRadius: 100,
    borderColor: '#fff',
    borderWidth: 5,
  },

  postOptions: {
    width: 13,
    height: 8,
    marginLeft: 'auto',
  },

  postTime: {
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 10,
  },

  postText: {
    color: '#000',
    fontSize: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontFamily: 'OpenSans-Regular',
    paddingLeft: 20,
    paddingRight: 20,
  },

  hours: {
    marginRight: 15,
    color: '#969696',
  },

  date: {
    color: '#969696',
  },

  postTextDark: {
    color: '#fff',
    fontSize: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontFamily: 'OpenSans-Regular',
    paddingLeft: 20,
    paddingRight: 20,
  },

  likeAndShareContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 15,
    paddingBottom: 15,
    // borderBottomColor: '#C9C9C9',
    // borderBottomWidth: 1,
  },

  postLikeIcon: {
    width: 30,
    height: 25,
    marginRight: 20,
  },

  sharePostIcon: {
    width: 23.5,
    height: 25,
  },

  commentInputContainer: {
    backgroundColor: '#fff',
    position: 'absolute',
    height: 100,
    width: '100%',
    bottom: 0,
    left: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.55,
    shadowRadius: 14.78,

    elevation: 22,
  },

  commentInputContainerDark: {
    backgroundColor: '#1A1A1A',
    position: 'absolute',
    height: 100,
    width: '100%',
    bottom: 0,
    left: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.55,
    shadowRadius: 14.78,

    elevation: 22,
  },

  commentInput: {
    borderBottomColor: '#1C1C98',
    borderBottomWidth: 2,
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 5,
    marginBottom: 5,
  },

  commentInputDark: {
    color: '#C9C9C9',
    borderBottomColor: '#FFA072',
    borderBottomWidth: 2,
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 5,
    marginBottom: 5,
  },

  gifAttachContainer: {
    flexDirection: 'row',
  },

  attachmentIcon: {
    width: 23,
    height: 25,
    marginLeft: 20,
    marginTop: 5,
  },

  gifIcon: {
    height: 25,
    width: 25,
    marginTop: 5,
    marginLeft: 10,
  },

  replyButton: {
    backgroundColor: '#1C1C98',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 50,
  },

  replyButtonDark: {
    backgroundColor: '#FFA072',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 50,
  },

  bottomRowReply: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
  },

  replyButtonText: {
    color: '#fff',
  },
});
