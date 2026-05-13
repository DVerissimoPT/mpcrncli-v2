import React from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";
import auth from "@react-native-firebase/auth";

export default function SocialBtn({ socialIcon }) {
  let iconList = {
    "1": require("../assets/images/icon-facebook-8.png"),
    "2": require("../assets/images/icon-google-8.png"),
    "3": require("../assets/images/icon-twitter-8.png"),
  };

  if (socialIcon == "1") {
    return (
      <TouchableOpacity>
        <View style={styles.socialBtn}>
          <Image
            style={styles.socialNetFacebook}
            source={iconList[socialIcon]}
          />
        </View>
      </TouchableOpacity>
    );
  } else if (socialIcon == "2") {
    return (
      <TouchableOpacity>
        <View style={styles.socialBtn}>
          <Image
            style={styles.socialNetFacebook}
            source={iconList[socialIcon]}
          />
        </View>
      </TouchableOpacity>
    );
  } else if (socialIcon == "3") {
    return (
      <TouchableOpacity>
        <View style={styles.socialBtn}>
          <Image
            style={styles.socialNetFacebook}
            source={iconList[socialIcon]}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  socialBtn: {
    width: 55,
    height: 55,
    backgroundColor: "#fff",
    borderRadius: 50,
    marginLeft: 5,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  socialNetFacebook: {
    width: 35,
    height: 36,
  },
});
