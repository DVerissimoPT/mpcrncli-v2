import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, Text, View, Image } from "react-native";
import { GlobalContext } from "../context/Context";
import { TextInput, ActivityIndicator } from "react-native-paper";
import firestore, { firebase } from "@react-native-firebase/firestore";
import { auto } from "async";

export default function ParameterStats({ param, time, lastTime, cycle }) {
  const { darkEnabled } = useContext(GlobalContext);
  useEffect(() => {
    console.log("time", time);
    console.log("lasttime", lastTime);
  });
  return (
    <View style={styles.containerParams}>
      <Text style={darkEnabled ? styles.paramNameDark : styles.paramName}>
        {param}
      </Text>
      <View style={styles.paramStats}>
        <Text style={darkEnabled ? styles.paramTextDark : styles.paramText}>Completed in 5 study cycles.</Text>
        <Text style={darkEnabled ? styles.paramTimeDark : styles.paramTime}>
          {!isNaN(time) && !isNaN(lastTime)
            ? new Date((time - lastTime) * 1000).toISOString().substr(11, 8)
            : "Error trying to get the time"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerParams: {
    justifyContent: "flex-start",
    width: 300,
    marginTop: 30,
  },

  paramName: {
    color: "#1c1c9b",
    fontFamily: "Nunito-Bold",
    fontSize: 18,
  },

  paramNameDark: {
    color: "#ffa072",
    fontFamily: "Nunito-Bold",
    fontSize: 18,
  },

  paramStats: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },

  paramText: {
    fontFamily: "Nunito",
    maxWidth: 200,
    color: "#1a1a1a",
  },

  paramTextDark: {
    fontFamily: "Nunito",
    maxWidth: 200,
    color: "#fff",
  },

  paramTime: {
    fontFamily: "Nunito-Bold",
    fontSize: 25,
    color: "#1c1c9b",
  },

  paramTimeDark: {
    fontFamily: "Nunito-Bold",
    fontSize: 25,
    color: "#ffa072",
  },
});
