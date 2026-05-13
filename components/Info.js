import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { GlobalContext } from "../context/Context";
import { Tooltip, Text } from "react-native-elements";

export default function Info(props) {
  const { darkEnabled } = useContext(GlobalContext);
  const { dif, text, size } = props;
  return (
    <Tooltip
      backgroundColor={darkEnabled ? "#ffa072" : "#1C1C98"}
      overlayColor="rgba(250, 250, 250, 0.80)"
      height={size}
      popover={<Text style={{ color: "#fff" }}>{text}</Text>}
    >
      <View
        style={
          darkEnabled
            ? dif
              ? styles.infoContainerDarkDif
              : styles.infoContainerDark
            : dif
            ? styles.difInfoContainer
            : styles.infoContainer
        }
      >
        <Text style={darkEnabled && dif ? styles.iDarkDif : styles.i}>i</Text>
      </View>
    </Tooltip>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: "#1C1C98",
    width: 20,
    height: 20,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  difInfoContainer: {
    backgroundColor: "#ed6663",
    width: 20,
    height: 20,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  infoContainerDark: {
    backgroundColor: "#FFA072",
    width: 20,
    height: 20,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  infoContainerDarkDif: {
    backgroundColor: "#fff",
    width: 20,
    height: 20,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  i: {
    color: "#fff",
    fontFamily: "Nunito-Bold",
    fontSize: 14,
  },

  iDarkDif: {
    color: "#FFA072",
    fontFamily: "Nunito-Bold",
    fontSize: 14,
  },
});
