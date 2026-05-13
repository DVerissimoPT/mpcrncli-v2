import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GlobalContext } from '../context/Context';
import { useNavigation } from '@react-navigation/native';
import firestore, { firebase } from '@react-native-firebase/firestore';

export default function Comment({ key_id, comments }) {
  const { darkEnabled, userImg, userUId } = useContext(GlobalContext);
  const { fetchUserId } = useContext(GlobalContext);
  const navigation = useNavigation();

  const addLiked = () => {
    let likes = comments.likes;

    let uid = userUId;
    let exists = likes.includes(uid);
    if (!exists) {
      likes.push(uid);
      firestore()
        .doc('comments/' + comments.key)
        .update({ likes: likes });
    } else {
      likes.splice(likes.indexOf(uid), 1);
      firestore()
        .doc('comments/' + comments.key)
        .update({ likes: likes });
    }
  };

  return (
    <View style={styles.commentContainer}>
      <View>
        <Image
          style={
            darkEnabled
              ? styles.commentProfilePicDark
              : styles.commentProfilePic
          }
          source={{ uri: userImg }}
        />
      </View>
      <View style={styles.commentInfoContainer}>
        <View style={styles.nameRow}>
          <View style={styles.nameAt}>
            <Text
              style={
                darkEnabled
                  ? styles.commentAuthorNameDark
                  : styles.commentAuthorName
              }
            >
              {comments.autor}
            </Text>
            <Text style={styles.date}>{}</Text>
          </View>
          <Image
            style={styles.commentOptions}
            source={require('../assets/images/post-options-8.png')}
          />
        </View>
        <Text style={styles.at}>@emabonito223</Text>

        <Text
          style={darkEnabled ? styles.commentTextDark : styles.commentText}
          onPress={() =>
            navigation.navigate('PostDetails', {
              ref_post: comments.key,
              autor: comments.autor,
              post: comments.post,
              data_post: comments.data_post.toDate().toDateString(),
              ref_user: comments.ref_user,
              media: comments.media,
              likes: comments.likes,
              isCommentTable: true,
            })
          }
        >
          {comments.post}
        </Text>
        <View style={styles.commentsLikesShareContainer}>
          <View style={styles.commentsAndLikes}>
            <View style={styles.commentRow}>
              <TouchableOpacity>
                <Image
                  style={styles.commentIcon}
                  source={
                    darkEnabled
                      ? require('../assets/images/post-comments-dark-8.png')
                      : require('../assets/images/post-comments-8.png')
                  }
                />
              </TouchableOpacity>
              <Text
                style={darkEnabled ? styles.commentNumDark : styles.commentNum}
              >
                {comments.replies.length}
              </Text>
            </View>

            <View style={styles.commentRow}>
              <TouchableOpacity onPress={addLiked}>
                <Image
                  style={styles.likesIcon}
                  source={
                    darkEnabled
                      ? require('../assets/images/post-heart-dark-8.png')
                      : require('../assets/images/post-heart-8.png')
                  }
                />
              </TouchableOpacity>
              <Text
                style={darkEnabled ? styles.commentNumDark : styles.commentNum}
              >
                {comments.likes.length}
              </Text>
            </View>
          </View>

          <View>
            <Image
              style={styles.shareIcon}
              source={
                darkEnabled
                  ? require('../assets/images/share-post-dark-8.png')
                  : require('../assets/images/share-post-8.png')
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentProfilePic: {
    width: 60,
    height: 60,
    borderRadius: 100,
    borderColor: '#1C1C98',
    borderWidth: 5,
  },

  commentProfilePicDark: {
    width: 60,
    height: 60,
    borderRadius: 100,
    borderColor: '#fff',
    borderWidth: 5,
  },

  commentContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingRight: 60,
    borderBottomColor: '#C9C9C9',
    borderBottomWidth: 1,
  },

  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 20,
  },

  nameAt: {
    flexDirection: 'row',
  },

  date: {
    marginLeft: 15,
    fontSize: 15,
    fontFamily: 'Nunito-Bold',
    color: '#969696',
  },

  commentAuthorName: {
    fontSize: 18,
    color: '#1C1C98',
    fontFamily: 'Nunito-Bold',
  },

  commentAuthorNameDark: {
    fontSize: 18,
    color: '#FFA072',
    fontFamily: 'Nunito-Bold',
  },

  commentInfoContainer: {
    paddingLeft: 10,
    width: '100%',
  },

  commentOptions: {
    width: 13,
    height: 8,
    alignSelf: 'center',
  },

  commentText: {
    color: '#000',
    fontSize: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontFamily: 'OpenSans-Regular',
    marginTop: 10,
    marginRight: 20,
  },

  commentTextDark: {
    color: '#fff',
    fontSize: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontFamily: 'OpenSans-Regular',
    marginTop: 10,
    marginRight: 20,
  },

  commentIcon: {
    width: 25,
    height: 21,
  },

  at: {
    color: '#969696',
  },

  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  commentNum: {
    fontSize: 18,
    marginLeft: 5,
    color: '#1C1C98',
    fontFamily: 'Nunito-Bold',
  },

  commentNumDark: {
    fontSize: 18,
    marginLeft: 5,
    color: '#FFA072',
    fontFamily: 'Nunito-Bold',
  },

  likesIcon: {
    width: 25,
    height: 21,
    marginLeft: 20,
  },

  commentsLikesShareContainer: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between',
  },

  commentsAndLikes: {
    flexDirection: 'row',
  },

  shareIcon: {
    height: 21,
    width: 19.5,
    marginRight: 20,
  },
});
