import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import firestore, { firebase } from '@react-native-firebase/firestore';
import { GlobalContext } from "../context/Context";
const moment = require('moment');

export default function Notifications({fetch,navigation,host_id}) {
  const { darkEnabled } = useContext(GlobalContext);
  const [notif_from_data,setNotif_from_data] = useState([]);
  const [post_data,setPost_data] = useState([]);
  let text = '';

  switch(fetch.type){
    case 'like':
        text = 'liked';
    break;
    case 'comment':
        text = 'commented';
    break;
  }

  let data = new Date(fetch.notification_date.toDate());
  data = moment(data).fromNow();

  useEffect(()=>{
    fetch.notification_from.get().then((qs)=>{
      let temp = [];
      temp.push({
        ...qs.data(),
        key : qs.id,
      });
      setNotif_from_data(temp[0]);
    });
  
    fetch.ref_post.get().then((qs)=>{
      let temp = [];
      temp.push({
        ...qs.data(),
        key : qs.id,
      });
      setPost_data(temp[0]);
    });
  },[])
  
  return (
    <TouchableOpacity style={styles.notificationContainer}
    onPress={()=>navigation.navigate('PostDetails',{
      ref_post : post_data.id,
      autor : post_data.autor,
      post : post_data.post,
      data_post: post_data.data_post,
      ref_user: post_data.ref_user,
      media: post_data.media,
      likes: post_data.likes,
      isCommentTable: false,
      key_id:post_data.id,
      host_id:host_id,
    })}>
      <TouchableOpacity style={{ width: 60 }} onPress={()=>{
            navigation.navigate('Profile',{
              ref_user: firestore().doc('users/'+notif_from_data.key),
              autor : notif_from_data.username,
              host_id:host_id
            })
          }}>
        <Image
          style={darkEnabled ? styles.profilePicDark : styles.profilePic}
          source={require("../assets/images/profilepic-test-8.png")}
        />
      </TouchableOpacity>
      <View style={{ flexDirection: "column" }}>
        <View style={{ height: 20, flexDirection: "row" }}>
          <TouchableOpacity
          onPress={()=>{
            navigation.navigate('Profile',{
              ref_user: firestore().doc('users/'+notif_from_data.key),
              autor : notif_from_data.username,
              host_id:host_id
            })
          }}>
            <Text
              style={
                darkEnabled
                  ? styles.notificationLinkDark
                  : styles.notificationLink
              }
            >
              {notif_from_data.username}
            </Text>
          </TouchableOpacity>
          <Text
            style={
              darkEnabled
                ? styles.notificationTextDark
                : styles.notificationText
            }
          >
            {text} your post
          </Text>
        </View>
        <Text style={darkEnabled ? styles.notificationTimeDark : styles.notificationTime}>{data}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  notificationContainer: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 50,
    paddingBottom: 50,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    alignItems: "center",
  },

  profilePic: {
    width: 45,
    height: 45,
    borderRadius: 50,
    borderColor: "#1c1c98",
    borderWidth: 3,
    marginRight: 20,
  },

  profilePicDark: {
    width: 45,
    height: 45,
    borderRadius: 50,
    borderColor: "#fff",
    borderWidth: 3,
    marginRight: 20,
  },

  notificationText: {
    color: "#1a1a1a",
  },

  notificationTextDark: {
    color: "#fff",
  },

  notificationTime: {
    color: "#ccc",
  },

  notificationTimeDark: {
    color: "#888",
  },

  notificationLink: {
    color: "#ed6663",
    marginRight: 2,
  },

  notificationLinkDark: {
    color: "#ffa072",
    marginRight: 2,
  },
});
