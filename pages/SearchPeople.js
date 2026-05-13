import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { GlobalContext } from "../context/Context";
import firestore, { firebase } from "@react-native-firebase/firestore";

export default function SearchPeople({ navigation }) {
  const { darkEnabled } = useContext(GlobalContext);
  const [fetchPeople, setFetchPeople] = useState([]);
  const { hostInformation } = useContext(GlobalContext);

  const performFetch = (text) => {
    firestore()
      .collection("users")
      .orderBy("username")
      .startAt(text)
      .endAt(text + "\uf8ff")
      .limit(15)
      .get()
      .then((qs) => {
        let tmp = [];
        qs.forEach((ds, i) => {
          tmp.push({
            ...ds.data(),
            key: ds.id,
          });
          if (i == qs.size - 1) {
            setFetchPeople(tmp);
          }
        });
      });
  };

  return (
    <ScrollView
      style={
        darkEnabled ? styles.searchContainerDark : styles.searchContainer
      }
    >
      {/* header */}
      <View style={darkEnabled ? styles.searchNavDark : styles.searchNav}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.goBackIconContainer}
        >
          <Image
            style={styles.goBackIcon}
            source={require("../assets/images/goback-icon-8.png")}
          />
        </TouchableOpacity>
        <TextInput
          placeholder="Search for people"
          placeholderTextColor="#eee"
          style={darkEnabled ? styles.searchBarDark : styles.searchBar}
          onChangeText={(text) => {
            performFetch(text);
          }}
        />
      </View>
      {fetchPeople.map((v, i) => {
        return (
          <View
            style={{
              flex: 1,
              backgroundColor: "#1a1a1a",
            }}
          >
            <TouchableOpacity
              style={
                darkEnabled ? styles.peopleContentDark : styles.peopleContent
              }
              onPress={() =>
                navigation.navigate("Profile", {
                  ref_user: firestore().doc("users/" + v.key),
                  autor: v.username,
                  host_id: hostInformation.key,
                })
              }
            >
              <TouchableOpacity
                style={{ width: 60, height: 30 }}
                onPress={() =>
                  navigation.navigate("Profile", {
                    ref_user: firestore().doc("users/" + v.key),
                    autor: v.username,
                    host_id: hostInformation.key,
                  })
                }
              >
                <Image
                  style={
                    darkEnabled ? styles.profilePicDark : styles.profilePic
                  }
                  source={{uri:v.profilePic}}
                />
              </TouchableOpacity>
              <Text
                style={darkEnabled ? styles.peopleNameDark : styles.peopleName}
              >
                {v.username}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    display: "flex",
    flex: 1,
    backgroundColor: "#fff",
  },

  searchContainerDark: {
    display: "flex",
    flex: 1,
    backgroundColor: "#1a1a1a",
  },

  searchNav: {
    flexDirection: "row",
    height: 80,
    backgroundColor: "#1C1C98",
    alignItems: "center",
    justifyContent: "center",
  },

  searchNavDark: {
    flexDirection: "row",
    height: 80,
    backgroundColor: "#ffa072",
    alignItems: "center",
    justifyContent: "center",
  },

  goBackIconContainer: {
    marginLeft: 15,
  },

  goBackIcon: {
    width: 15,
    height: 30,
  },

  searchBar: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#ddd",
    width: "70%",
    color: "#fff",
    marginLeft: 30,
    marginRight: 30,
    padding: 10,
    paddingBottom: 2,
  },

  searchBarDark: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#fff",
    width: "70%",
    color: "#fff",
    marginLeft: 30,
    marginRight: 30,
    padding: 10,
    paddingBottom: 2,
  },

  peopleContent: {
    // height: 20,
    width: "100%",
    flexDirection: "row",
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    alignItems: "center",
    backgroundColor:"#fff",
  },

  peopleContentDark: {
    // height: 20,
    width: "100%",
    flexDirection: "row",
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    alignItems: "center",
  },

  profilePic: {
    width: 35,
    height: 35,
    borderRadius: 50,
    borderColor: "#1C1C98",
    borderWidth: 3,
    marginRight: 20,
  },

  profilePicDark: {
    width: 35,
    height: 35,
    borderRadius: 50,
    borderColor: "#fff",
    borderWidth: 3,
    marginRight: 20,
  },

  peopleName: {
    fontSize: 18,
    color: "#333333",
    fontFamily: "Nunito-SemiBold",
  },

  peopleNameDark: {
    fontSize: 18,
    color: "#ffffff",
    fontFamily: "Nunito-SemiBold",
  },
});
