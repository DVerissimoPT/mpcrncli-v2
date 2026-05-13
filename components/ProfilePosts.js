import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Post from './Post';
import { GlobalContext } from '../context/Context';

export default function ProfilePosts({
  navigation,
  route,
  screenProps,
  posts,
  host_id,
}) {
  const { togglePostsScrolled, scrollToTop, darkEnabled } = useContext(
    GlobalContext
  );

  //console.log(posts.length);

  return (
    <View
      style={darkEnabled ? styles.postsContainerDark : styles.postsContainer}
    >
      {posts.length == 0 ? (
        <Text
          style={
            darkEnabled
              ? { fontFamily: 'Nunito-SemiBold', fontSize: 15, color: '#fff' }
              : {
                  fontFamily: 'Nunito-SemiBold',
                  fontSize: 15,
                  color: '#1C1C98',
                }
          }
        >
          This user has not posted yet
        </Text>
      ) : (
        <FlatList
          onScroll={togglePostsScrolled}
          data={posts}
          renderItem={({ item }) => (
            <Post
              key_id={item.key}
              autor={item.autor}
              post={item.post}
              media={item.media}
              data_post={item.data_post.toDate()}
              ref_user={item.ref_user}
              style={styles.feedContainer}
              likes={item.likes}
              host_id={host_id}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  feedContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },

  postsContainer: {
    backgroundColor: '#fff',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  postsContainerDark: {
    backgroundColor: '#1A1A1A',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
