import React, { useEffect, useContext, useState } from 'react';
import { View, Text } from 'react-native';
import {
  Button,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import { globalStyles } from '../styles/GlobalStyles';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { GlobalContext } from '../context/Context';
import Post from '../components/Post';

export default function ProfileLiked({ host_id, ref_user }) {
  const [posts, setPosts] = useState([]);
  const { fetchU } = useContext(GlobalContext);
  const { isBarVisible, userId, userUId } = useContext(GlobalContext);

  useEffect(() => {
    console.log(ref_user._documentPath._parts[1]);
    firestore()
      .collection('posts')
      .where('likes', 'array-contains', userUId)
      .get()
      .then((qs) => {
        console.log(qs);
        let t_p = [];
        qs.forEach((ds) => {
          t_p.push({
            ...ds.data(),
            key: ds.id,
          });
        });
        console.log('fejsfjefjewjf');
        console.log(t_p);
        setPosts(t_p);
      });
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      {posts.map((v, i) => {
        return (
          <Post
            // username={item.ref_user.get().then((snap) => {
            //   item.autor = snap.data().username;
            // })}
            index={v.i}
            key_id={v.key}
            autor={v.autor}
            post={v.post}
            style={styles.feedContainer}
            data_post={v.data_post.toDate()}
            ref_user={v.ref_user}
            media={v.media}
            likes={v.likes}
            host_id={host_id}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  feedContainer: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
});
