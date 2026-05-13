import React, { useContext } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { GlobalContext } from "../context/Context";

export default function ParameterList({ param }) {
  const { darkEnabled } = useContext(GlobalContext);

  return (
    <View style={darkEnabled ? styles.paramDark : styles.param}>
      <Text style={darkEnabled ? styles.paramTxtDark : styles.paramTxt}>
        {param}
      </Text>
      <View style={styles.linesContainer}>
        <View style={darkEnabled ? styles.lineDark : styles.line} />
        <View style={darkEnabled ? styles.lineDark : styles.line} />
        <View style={darkEnabled ? styles.lineDark : styles.line} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  param: {
    width: "100%",
    padding:10,
    color: "#1C1C98",
    borderColor: "#1C1C98",
    borderWidth: 1.5,
    borderRadius: 10,
    marginTop: 5,
    display:"flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  paramDark: {
    width: "100%",
    padding: 10,
    color: "#ffa072",
    borderColor: "#ffa072",
    borderWidth: 1.5,
    borderRadius: 10,
    marginTop: 5,
    display:"flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  paramTxt: {
    color: "#1a1a1a",
  },

  paramTxtDark: {
    color: "#fff",
  },

  linesContainer: {
    height: "100%",
    width: 20,
  },

  line: {
    height: 3,
    backgroundColor: "#1c1c98",
    width: "100%",
    borderRadius: 20,
    marginBottom: 2,
    marginTop: 2,
  },

  lineDark: {
    height: 3,
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 20,
    marginBottom: 2,
    marginTop: 2,
  },
});
