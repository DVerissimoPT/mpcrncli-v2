import React, { useEffect, useContext, useState } from 'react';
import firestore, { firebase } from '@react-native-firebase/firestore';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableHighlight,
} from 'react-native';
import { globalStyles } from '../styles/GlobalStyles';
import Post from '../components/Post';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
  State,
} from 'react-native-gesture-handler';
import PostImage from '../components/PostImage';
import { GlobalContext } from '../context/Context';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import { isEmpty, isNull, isUndefined, forEach } from 'lodash';
import * as glb from '../scripts/global.js';
import { useIsFocused } from '@react-navigation/native';

export default function Feed({ route, navigation }) {
  const {
    darkEnabled,
    toggleTheme,
    userImg,
    followersList,
    username,
  } = useContext(GlobalContext);
  const { isBarVisible, userId, userUId } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [fetchPostArr, setFetchPostArr] = useState([]);
  const { fetchU } = useContext(GlobalContext);
  const [meusDados, setmeusDados] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [dateLastPost, setDateLastPost] = useState(null);
  const [followingList, setFollowingList] = useState([]);
  const [canRef, setCanRef] = useState(0);
  const { saveHostInfo, hostInformation } = useContext(GlobalContext);
  const { saveFeedArr, feedFetch } = useContext(GlobalContext);
  const { feedNeedsUp, setFeedNeedsUp } = useContext(GlobalContext);
  const [currentEnd, setCurrentEnd] = useState(null);
  const [length, setLength] = useState(0);
  const [currentStart, setCurrentStart] = useState(0);
  const [retrieveNum, setRetrieveNum] = useState(20);
  let state = {
    limit: 10,
    currentStart: 0,
    currentEnd: null,
    length: 0,
    updating: false,
    temp_key_holder: [],
    last_date_post: null,
  };
  const userN = fetchU;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused == true) {
      const subscriber = firestore()
        .collection('posts')
        .orderBy('data_post', 'desc')
        .limit(retrieveNum)
        .onSnapshot((querySnapshot) => {
          let data = [];
          querySnapshot.forEach((documentSnapshot) => {
            if (
              followersList.includes(
                documentSnapshot._data.ref_user._documentPath._parts[1]
              )
            ) {
              data.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            }
          });

          // console.log(data);
          setPosts(data.sort((a, b) => a.data_post < b.data_post));
        });

      isBarVisible(true);

      return () => subscriber();
    }
  }, [followersList, isFocused, retrieveNum]);

  const retrieveMore = () => {
    setRetrieveNum(retrieveNum + 15);
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

  // const retrieveMore = function() {
  //   setRefreshing(true);
  //   let array_copy = [];
  //   fetchPostArr.forEach((v) => {
  //     array_copy.push(v);
  //   });

  //   let number = state.limit;
  //   let ind = currentEnd;

  //   if (array_copy[currentEnd + state.limit] === undefined) {
  //     let gap = 0;
  //     gap = currentEnd + state.limit + 1 - array_copy.length;
  //     gap = state.limit - gap;
  //     setCurrentEnd(ind + gap);
  //     ind += gap;
  //   } else {
  //     setCurrentStart(currentEnd);
  //     setCurrentEnd(ind + 10);
  //     ind += 10;
  //   }

  //   setLastVisible(array_copy[ind]);
  //   let final_arr = [...posts, ...array_copy.slice(currentEnd + 1, ind + 1)];
  //   glb.orderArrByDateDesc(final_arr);
  //   setPosts(final_arr);
  //   setRefreshing(false);
  // };

  return (
    <View style={darkEnabled ? styles.feedContainerDark : styles.feedContainer}>
      <View style={darkEnabled ? styles.newPostBtnDark : styles.newPostBtn}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddPost')}
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            style={{ width: 25, height: 25 }}
            source={require('../assets/images/pencil-8.png')}
          />
        </TouchableOpacity>
      </View>
      <Image
        style={globalStyles.smallLogo}
        source={
          darkEnabled
            ? require('../assets/images/small-logo-white-8.png')
            : require('../assets/images/small-logo-8.png')
        }
      />
      <View style={globalStyles.navContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Profile', {
              ref_user: firestore().doc('users/' + userId),
              autor: username,
              host_id: userId,
            })
          }
        >
          <Image
            style={
              darkEnabled
                ? globalStyles.profilePicDark
                : globalStyles.profilePic
            }
            source={{ uri: userImg }}
          />
        </TouchableOpacity>
        <Text
          style={
            darkEnabled ? globalStyles.navTitleDark : globalStyles.navTitle
          }
        >
          TIMELINE
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SearchPeople')}>
          <Image
            style={globalStyles.searchIcon}
            source={
              darkEnabled
                ? require('../assets/images/search-icon-white-8.png')
                : require('../assets/images/search-icon-8.png')
            }
          />
        </TouchableOpacity>
      </View>

        {posts.length == 0 ? (<View>
          <Text>
            You don't have any posts to see yet.
          </Text>
        </View>) : (<FlatList
        style={styles.flatList}
        data={posts}
        maxToRenderPerBatch={5}
        renderItem={({ item }) => {
          console.log(item.media);
          return (
            <Post
              // username={item.ref_user.get().then((snap) => {
              //   item.autor = snap.data().username;
              // })}
              index={item.index}
              key_id={item.key}
              autor={item.autor}
              post={item.post}
              style={styles.feedContainer}
              data_post={item.data_post.toDate()}
              ref_user={item.ref_user}
              media={item.media}
              likes={item.likes}
              host_id={userId}
            />
          );
        }}
        onEndReached={retrieveMore}
        onEndReachedThreshold={0.1}
        refreshing={refreshing}
      />) }    
        

      {refreshing ? (
        <ActivityIndicator
          size='large'
          color={darkEnabled ? '#ffa072' : '#1C1C98'}
        />
      ) : (
        <View />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  feedContainer: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },

  flatList: {
    zIndex: -1,
  },

  newPostBtn: {
    position: 'absolute',
    backgroundColor: '#1C1C98',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    width: 55,
    height: 55,
    zIndex: 1000,
    right: 20,
    bottom: 20,
  },

  newPostBtnDark: {
    position: 'absolute',
    backgroundColor: '#ff9f72',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    width: 55,
    height: 55,
    zIndex: 1000,
    right: 20,
    bottom: 20,
  },

  feedContainerDark: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#1A1A1A',
  },
});
