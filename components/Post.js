import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Modal,
} from 'react-native';
import { globalStyles } from '../styles/GlobalStyles';
import { GlobalContext } from '../context/Context';
import { useNavigation } from '@react-navigation/native';
import ImageView from 'react-native-image-viewing';
import { useEffect } from 'react';
import Video from 'react-native-video';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { includes } from 'lodash';
import * as glb from '../scripts/global.js';

let windowWidth = Dimensions.get('window').width;
var player;

export default function Post({
  autor,
  post,
  data_post,
  ref_user,
  media,
  key_id,
  index,
  likes,
  host_id,
  userImg,
}) {
  const { darkEnabled, userUId } = useContext(GlobalContext);
  const [replyCount, setreplyCount] = useState(0);
  const navigation = useNavigation();
  const [visible, setIsVisible] = useState(null);
  const [resizeMode, setResizeMode] = useState('cover');
  const [liked, setLiked] = useState(false);
  const [profilePic, setprofilePic] = useState('');
  let reply_count = 0;
  let uid = userUId;

  useEffect(() => {
    let path = 'posts/' + key_id;
    let parent_post = firestore().doc(path);
    firestore()
      .collection('comments')
      .where('ref_parent', '==', parent_post)
      .get()
      .then((qs) => {
        let size = qs.size;
        if (size == 0) {
          setreplyCount(0);
        } else {
          qs.forEach((ss, i) => {
            reply_count++;
            if (i == size - 1) {
              setreplyCount(reply_count);
            }
          });
        }
        ref_user.get().then((qs) => {
          checkUserLike(likes, true);
          setprofilePic(qs.data().profilePic);
        });
      });
  }, []);

  const addLiked = () => {
    console.log('@@@@@@@@@@', key_id);
    if (!checkUserLike(likes, false)) {
      likes.push(uid);
      firestore()
        .doc('posts/' + key_id)
        .update({ likes: likes });
      setLiked(true);
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
      setLiked(false);
    }
  };

  const checkUserLike = (source, state) => {
    if (state) {
      if (source.includes(uid)) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    } else {
      if (source.includes(uid)) {
        return true;
      } else {
        return false;
      }
    }
  };

  // if (loading) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         backgroundColor: '#fff',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //       }}
  //     >
  //       <ActivityIndicator
  //         size='large'
  //         color={darkEnabled ? '#ffa072' : '#1C1C98'}
  //       />
  //     </View>
  //   );
  // }

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('PostDetails', {
          ref_post: key_id,
          autor: autor,
          post: post,
          data_post: data_post,
          ref_user: ref_user,
          media: media,
          likes: likes,
          isCommentTable: false,
          key_id: key_id,
          host_id: host_id,
          profilePic: profilePic,
        })
      }
      style={darkEnabled ? styles.postContainerDark : styles.postContainer}
    >
      <ImageView
        visible={visible}
        images={media}
        imageIndex={0}
        onRequestClose={() => setIsVisible(false)}
      />
      <View style={styles.topRowPost}>
        <TouchableOpacity
          style={styles.postAuthor}
          onPress={() =>
            navigation.navigate('Profile', {
              ref_user: ref_user,
              autor: autor,
              host_id: host_id,
            })
          }
        >
          <Image
            style={
              darkEnabled
                ? globalStyles.profilePicDark
                : globalStyles.profilePic
            }
            source={
              profilePic
                ? { uri: profilePic }
                : require('../assets/images/logo-hor.png')
            }
          />
          <Text style={darkEnabled ? styles.authorNameDark : styles.authorName}>
            {autor}
          </Text>
        </TouchableOpacity>
        <Text style={darkEnabled ? styles.postTimeDark : styles.postTime}>
          {data_post.toDateString()}
        </Text>
      </View>

      <View style={styles.postContent}>
        <TouchableOpacity onPress={addLiked} style={styles.heartContainer}>
          <Image
            style={liked ? styles.heartIconTint : styles.heartIcon}
            source={require('../assets/images/heart-icon-8.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('PostDetails', {
              ref_post: key_id,
              autor: autor,
              post: post,
              data_post: data_post,
              ref_user: ref_user,
              media: media,
              likes: likes,
              isCommentTable: false,
              key_id: key_id,
              host_id: host_id,
              profilePic:profilePic,
            })
          }
          style={styles.textContainer}
        >
          <Text style={darkEnabled ? styles.postTextDark : styles.postText}>
            {post}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.postImageContainer}>
        {media.length > 0 ? (
          media.map((image, index) => {
            if (media.length === 1) {
              if (image.type === 'video') {
                return (
                  <TouchableOpacity>
                    <Video
                      source={{ uri: image.uri }}
                      ref={(ref) => {
                        player = ref;
                      }}
                      style={{
                        width: windowWidth - 90,
                        height: 200,
                        marginLeft: 3,
                        marginTop: 6,
                        borderRadius: 10,
                      }}
                      onBuffer={() => {
                        console.log('buffering');
                      }}
                      resizeMode='cover'
                      onLoad={() => {
                        console.log('load finished');
                      }}
                      onError={() => {
                        console.log('erro a dar load');
                      }}
                    />
                  </TouchableOpacity>
                );
              } else {
                return (
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        setIsVisible(true);
                      }}
                      key={index}
                    >
                      <Image
                        style={{
                          width: windowWidth - 90,
                          height: 200,
                          borderRadius: 10,
                          marginRight: 3,
                          marginLeft: 3,
                          marginTop: 6,
                        }}
                        source={{ uri: image.uri }}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }
            } else {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setIsVisible(true);
                  }}
                >
                  <Image
                    style={{
                      width: windowWidth / 2 - 45,
                      height: 140,
                      borderRadius: 10,
                      marginRight: 3,
                      marginLeft: 3,
                      marginTop: 6,
                    }}
                    source={{ uri: image.uri }}
                  />
                </TouchableOpacity>
              );
            }
          })
        ) : (
          <View key={0} />
        )}
      </View>

      <View style={styles.statsContainer}>
        <Text style={darkEnabled ? styles.responsesDark : styles.responses}>
          {replyCount} Responses
        </Text>
        <Text style={darkEnabled ? styles.likesDark : styles.likes}>
          {likes.length} Likes
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
    borderBottomColor: '#C9C9C9',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },

  postContainerDark: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
    borderBottomColor: '#C9C9C9',
    borderBottomWidth: 1,
    backgroundColor: '#1A1A1A',
  },

  heartIcon: {
    width: 30,
    height: 24,
    marginRight: 5,
  },

  heartIconTint: {
    tintColor: '#ffa072',
    width: 30,
    height: 24,
    marginRight: 5,
  },

  topRowPost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '85%',
    paddingTop: 15,
  },

  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  authorName: {
    marginLeft: 10,
    fontSize: 17,
    color: '#1C1C98',
    fontFamily: 'Nunito-SemiBold',
  },

  authorNameDark: {
    marginLeft: 10,
    fontSize: 17,
    color: '#FFA072',
    fontFamily: 'Nunito-SemiBold',
  },

  postContent: {
    flexDirection: 'row',
    marginTop: 15,
  },

  heartContainer: {
    width: '10%',
  },

  textContainer: {
    width: '73%',
  },

  postText: {
    color: '#000',
    fontSize: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontFamily: 'OpenSans-Regular',
  },

  postImageContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 'auto',
    // paddingRight: 20,
    paddingLeft: 60,
    // paddingTop: 20,
    // paddingBottom: 20,
    flexWrap: 'wrap',
  },

  postImage: {
    width: 100,
    height: 150,
  },

  postTextDark: {
    color: '#fff',
    fontSize: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontFamily: 'OpenSans-Regular',
  },

  postTime: {
    fontFamily: 'Nunito-Bold',
  },

  postTimeDark: {
    fontFamily: 'Nunito-Bold',
    color: '#969696',
  },

  statsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 15,
    width: '73%',
    marginLeft: '10%',
  },

  responses: {
    marginRight: 20,
    fontFamily: 'Nunito-SemiBold',
  },

  responsesDark: {
    marginRight: 20,
    fontFamily: 'Nunito-SemiBold',
    color: '#808080',
  },

  likes: {
    fontFamily: 'Nunito-SemiBold',
  },

  likesDark: {
    fontFamily: 'Nunito-SemiBold',
    color: '#808080',
  },

  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
