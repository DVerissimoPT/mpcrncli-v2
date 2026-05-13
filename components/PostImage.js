import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles/GlobalStyles";

export default function PostImage() {
  return (
    <TouchableOpacity style={styles.postContainer}>
      <View style={styles.topRowPost}>
        <View style={styles.rowPost}>
          <Image
            style={globalStyles.profilePic}
            source={require("../assets/images/ema-8.png")}
          />
          <Text style={styles.postAuthor}>Ema Bonito</Text>
        </View>
        <Text>6 secs</Text>
      </View>

      <View style={styles.postContent}>
        <View style={styles.heartContainer}>
          <Image
            style={styles.heartIcon}
            source={require("../assets/images/heart-icon-8.png")}
          />
        </View>

        <Image
          style={styles.postImageContainer}
          source={require("../assets/images/piano-8.png")}
        />
      </View>

      <Text style={styles.imagePostText}>
        E q belhos já viram o meu novo piano? Deem aí like
      </Text>

      <View style={styles.statsContainer}>
        <Text style={styles.responses}>6 Responses</Text>
        <Text>52 Likes</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    width: "100%",
    alignItems: "center"
  },

  postContent: {
    flexDirection: "row"
  },

  rowPost: {
    flexDirection: "row",
    alignItems: "center"
  },

  topRowPost: {
    width: "85%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 15,
    paddingBottom: 15,
    borderTopColor: "#C9C9C9",
    borderTopWidth: 2
  },

  postAuthor: {
    fontSize: 18,
    marginLeft: 10,
    color: "#1C1C98"
  },

  postText: {
    color: "#000",
    fontSize: 15
  },

  imagePostText: {
    color: "#000",
    fontSize: 15,
    marginLeft: "15%",
    width: "73%",
    marginTop: 5
  },

  textContainer: {
    width: "73%"
  },

  postImageContainer: {
    width: "73%",
    height: 180,
    borderRadius: 20
  },

  heartIcon: {
    width: 30,
    height: 24,
    marginRight: 5
  },

  heartContainer: {
    width: "12%",
    alignItems: "center"
  },

  statsContainer: {
    flexDirection: "row",
    width: "73%",
    marginLeft: "12%",
    marginTop: 13
  },

  responses: {
    marginRight: 20,
    paddingBottom: 20
  }
});
