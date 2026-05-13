import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  Component,
} from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { globalStyles } from '../styles/GlobalStyles';
import firestore, { firebase } from '@react-native-firebase/firestore';
import {
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native-gesture-handler';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ProfilePosts from '../components/ProfilePosts';
import ProfileLiked from '../components/ProfileLiked';
import ProfileMedia from '../components/ProfileMedia';
import { GlobalContext } from '../context/Context';
import { useIsFocused } from '@react-navigation/native';
import { includes } from 'lodash';

const Tab = createMaterialTopTabNavigator();

// function useForceUpdate(){
//   const [value, setValue] = useState(0); // integer state
//   return () => setValue(value => ++value); // update the state to force render
// }

export default function Practice({ navigation, route }) {
  const { darkEnabled, scrollPosition } = useContext(GlobalContext);
  const { isBarVisible } = useContext(GlobalContext);
  const { ref_user } = route.params;
  const { autor } = route.params;
  const { owner } = route.params;
  const { host_id } = route.params;
  const { setFeedNeedsUp } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState([]);
  const [posts, setPosts] = useState([]);
  const post_author_id = ref_user['_documentPath']['_parts'][1];
  const [followerData, setFollowerData] = useState({
    follower_count: 0,
    followed_by: 0,
  });
  const [followText, setFollowText] = useState('Follow');
  const host_id_doc_path = firestore().doc('users/' + host_id);
  const post_author_doc_path = firestore().doc('users/' + post_author_id);
  const isFocused = useIsFocused();

  const profileFollowUpdate = (path, val) => {
    path.get().then((w) => {
      let p_keys = Object.keys(w.data());
      let p_data = w.data();
      if (!p_keys.includes('followers')) {
        path.update({ followers: 1 });
        setFollowerData({
          follower_count: followerData.follower_count,
          followed_by: followerData.followed_by + 1,
        });
      } else {
        path.update({
          followers: p_data.followers + val,
        });
        setFollowerData({
          follower_count: followerData.follower_count,
          followed_by: followerData.followed_by + val,
        });
      }
    });
  };

  const CheckFollow = () => {
    host_id_doc_path.get().then((q) => {
      let keys = Object.keys(q.data());
      let data = q.data();
      if (!keys.includes('following')) {
        setFollowText('Follow');
      } else {
        let arr = data.following;
        if (arr.includes(post_author_id)) {
          setFollowText('Unfollow');
        } else {
          setFollowText('Follow');
        }
      }
    });
    return null;
  };

  const triggerFollow = () => {
    /*
    post_author_id,
    host_id
    */
    setFeedNeedsUp(true);

    host_id_doc_path.get().then((q) => {
      let keys = Object.keys(q.data());
      let data = q.data();
      if (!keys.includes('following')) {
        host_id_doc_path.update({ following: [post_author_id] });
        profileFollowUpdate(post_author_doc_path, 0);
        setFollowText('Unfollow');
      } else {
        let arr = data.following;
        if (arr.includes(post_author_id)) {
          arr.splice(arr.indexOf(post_author_id), 1);
          host_id_doc_path.update({ following: arr });
          profileFollowUpdate(post_author_doc_path, -1);
          setFollowText('Follow');
        } else {
          arr.push(post_author_id);
          host_id_doc_path.update({ following: arr });
          profileFollowUpdate(post_author_doc_path, 1);
          setFollowText('Unfollow');
        }
      }
    });
  };

  const populateFollowCount = () => {
    let isAuthor = false;

    if (post_author_id == host_id) {
      isAuthor = true;
    } else {
      isAuthor = false;
    }

    let following = 0;
    let followers = 0;

    let main_obj = null;
    if (isAuthor) {
      main_obj = host_id_doc_path;
    } else {
      main_obj = post_author_doc_path;
    }

    main_obj.get().then((q) => {
      let data = q.data();
      let keys = Object.keys(q.data());
      if (!keys.includes('following')) {
        //keep 0
      } else {
        following = data.following.length;
      }
      if (!keys.includes('followers')) {
        //keep 0
      } else {
        followers = data.followers;
      }

      setFollowerData({
        followed_by: followers,
        follower_count: following,
      });
    });
  };

  const EditProfileRenderer = () => {
    let isAuthor = false;

    if (post_author_id == host_id) {
      isAuthor = true;
    } else {
      isAuthor = false;
    }

    if (isAuthor) {
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('EditProfile', {
              ref_user: ref_user,
              autor: autor,
              owner: owner,
              profile: profile._data,
              host_id: host_id,
            });
          }}
          style={
            darkEnabled ? styles.editProfileBtnDark : styles.editProfileBtn
          }
        >
          <Text style={darkEnabled ? styles.editTextDark : styles.editText}>
            Edit Profile
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            //yolo
            triggerFollow();
          }}
          style={
            followText == 'Follow'
              ? darkEnabled
                ? styles.editProfileBtnDark
                : styles.editProfileBtn
              : darkEnabled
              ? styles.unfollowBtnDark
              : styles.unfollowBtn
          }
        >
          <Text
            style={
              followText == 'Follow'
                ? darkEnabled
                  ? styles.editTextDark
                  : styles.editText
                : darkEnabled
                ? styles.unfollowTextDark
                : styles.unfollowText
            }
          >
            {followText}
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  useEffect(() => {
    isBarVisible(false);
    console.log('ISBARVISIBLE?');
    console.log(ref_user);
    ref_user.get().then((snap) => {
      firestore()
        .collection('posts')
        .where('ref_user', '==', ref_user)
        .orderBy('data_post', 'desc')
        .get()
        .then((qs) => {
          const posts = [];
          qs.forEach((documentSnapshot, i) => {
            posts.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          setProfile(snap);
          setPosts(posts);
          populateFollowCount();
          CheckFollow();
        })
        .then(() => {
          setLoading(false);
        });
    });
    // return function cleanup() {
    //   isBarVisible(true);
    // };
  }, [isFocused]);

  if (loading) {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
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

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View
      style={
        darkEnabled ? styles.profileContainerDark : styles.profileContainer
      }
    >
      <View style={darkEnabled ? styles.profileNavDark : styles.profileNav}>
        <TouchableOpacity onPress={goBack}>
          <Image
            style={globalStyles.goBackIcon}
            source={require('../assets/images/goback-icon-8.png')}
          />
        </TouchableOpacity>
        <Image
          source={require('../assets/images/small-logo-white-8.png')}
          style={styles.smallLogo}
        />
        <View style={styles.profileOptionsIcon} />
      </View>
      <View
        style={
          scrollPosition > 500
            ? styles.profileInfoContainerScrolled
            : styles.profileInfoContainer
        }
      >
        <View style={styles.picEditContainer}>
          <View style={styles.profilePicContainer}>
            <Image
              style={darkEnabled ? styles.profilePicDark : styles.profilePic}
              source={{ uri: profile._data.profilePic }}
            />
          </View>

          <EditProfileRenderer />
        </View>

        <View style={styles.nameBioContainer}>
          <Text
            style={darkEnabled ? styles.profileNameDark : styles.profileName}
          >
            {profile._data.username}
          </Text>
          <Text style={darkEnabled ? styles.atName : styles.atName}>
            @emabonito885
          </Text>
          <Text style={darkEnabled ? styles.bioDark : styles.bio}>
            {profile._data.bio}
          </Text>

          <View style={styles.profileFollowContainer}>
            <TouchableOpacity>
              <Text
                style={darkEnabled ? styles.followTextDark : styles.followText}
              >
                {followerData.follower_count} Following
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text
                style={darkEnabled ? styles.followTextDark : styles.followText}
              >
                {followerData.followed_by} Followers
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Tab.Navigator
        tabBarOptions={
          darkEnabled
            ? {
                tabStyle: { backgroundColor: '#1A1A1A' },
                activeTintColor: '#FFA072',
                inactiveTintColor: '#fff',
              }
            : {
                activeBackgroundColor: '#1C1C98',
                inactiveBackgroundColor: '#fff',
                activeTintColor: '#1C1C98',
                inactiveTintColor: '#808080',
                shadowOpacity: 0,
                elevation: 0,
              }
        }
      >
        <Tab.Screen name='Posts'>
          {(props) => <ProfilePosts posts={posts} host_id={host_id} />}
        </Tab.Screen>
        <Tab.Screen name='Liked'>
          {(props)=><ProfileLiked host_id={host_id} ref_user={ref_user} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },

  profileContainerDark: {
    backgroundColor: '#1A1A1A',
    flex: 1,
  },

  profileName: {
    fontSize: 23,
    color: '#1C1C98',
    fontFamily: 'Nunito-Bold',
    marginTop: 10,
  },

  profileNameDark: {
    fontSize: 23,
    color: '#FFA072',
    fontFamily: 'Nunito-Bold',
    marginTop: 10,
  },

  atName: {
    color: '#808080',
    fontFamily: 'OpenSans-Regular',
  },

  atNameDark: {
    color: '#C9C9C9',
    fontFamily: 'OpenSans-Regular',
  },

  bio: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'OpenSans-Regular',
    marginTop: 10,
  },

  bioDark: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'OpenSans-Regular',
    marginTop: 10,
  },

  profileInfoContainer: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 15,
  },

  profileInfoContainerScrolled: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 15,
    display: 'none',
  },

  nameBioContainer: {
    width: '60%',
    paddingRight: 15,
  },

  profileNav: {
    backgroundColor: '#1C1C98',
    height: 100,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },

  profileNavDark: {
    backgroundColor: '#FFA072',
    height: 100,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },

  profilePicContainer: {
    width: 100,
    height: 100,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    marginTop: -30,
  },

  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderColor: '#fff',
    borderWidth: 7,
    marginBottom: -30,
  },

  profilePicDark: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderColor: '#fff',
    borderWidth: 7,
    marginBottom: -30,
  },

  smallLogo: {
    width: 30,
    height: 35,
    alignSelf: 'center',
    marginBottom: 35,
    marginLeft: 18,
  },

  profileOptionsIcon: {
    width: 33,
    height: 9,
    marginBottom: 35,
  },

  picEditContainer: {
    flexDirection: 'column',
    width: '40%',
    alignItems: 'center',
  },

  editProfileBtn: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 15,
    paddingLeft: 15,
    borderColor: '#1C1C98',
    borderWidth: 2,
    borderRadius: 50,
    marginTop: 25,
  },

  unfollowBtn: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 15,
    paddingLeft: 15,
    borderColor: '#FFA072',
    borderWidth: 2,
    borderRadius: 50,
    marginTop: 25,
  },

  unfollowBtnDark: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 15,
    paddingLeft: 15,
    borderColor: '#FFA072',
    borderWidth: 2,
    borderRadius: 50,
    marginTop: 25,
  },

  editProfileBtnDark: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 15,
    paddingLeft: 15,
    borderColor: '#FFA072',
    borderWidth: 2,
    borderRadius: 50,
    marginTop: 25,
  },

  editText: {
    fontSize: 15,
    fontFamily: 'Nunito-Bold',
    color: '#1C1C98',
  },

  editTextDark: {
    fontSize: 15,
    fontFamily: 'Nunito-Bold',
    color: '#FFA072',
  },

  unfollowText: {
    fontSize: 15,
    fontFamily: 'Nunito-Bold',
    color: '#FFA072',
  },

  unfollowTextDark: {
    fontSize: 15,
    fontFamily: 'Nunito-Bold',
    color: '#FFA072',
  },

  profileFollowContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },

  followText: {
    color: '#ED6663',
    fontFamily: 'Nunito-Bold',
    paddingRight: 15,
  },

  followTextDark: {
    color: '#FFA072',
    fontFamily: 'Nunito-Bold',
    paddingRight: 15,
  },
});
