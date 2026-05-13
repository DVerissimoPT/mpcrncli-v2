import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

export default function LoginButton({
  text,
  signUpHandler,
  type,
  loginHandler,
}) {
  return (
    <TouchableOpacity
      onPress={type === "Sign Up" ? signUpHandler : loginHandler}
    >
      <View style={styles.loginButton}>
        <Text style={styles.loginButtonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 100,
    paddingRight: 100,
    marginTop: 20,
    alignItems: "center",
  },

  loginButtonText: {
    fontFamily: "Nunito-Bold",
    fontSize: 17,
    color: "#1C1C9B",
  },
});
