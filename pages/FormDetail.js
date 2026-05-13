import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { GlobalContext } from "../context/Context";
// import { ScrollView } from 'react-native-gesture-handler';
import firestore, { firebase } from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

import Parameter from "../components/ParameterList";

export default function FormDetail({ navigation }) {
  const {
    darkEnabled,
    toggleStudyMode,
    currentForm,
    toggleFormState,
    currentFormName,
    setCurrentParams,
    currentParams,
  } = useContext(GlobalContext);
  const [params, setParams] = useState([]);
  const [formDetails, setFormDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firestore()
      .collection("forms")
      .where("author_name", "==", currentForm)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          setCurrentParams(documentSnapshot._data.parameters);
          setFormDetails(documentSnapshot._data);
        });

        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView
      contentContainerStyle={
        darkEnabled
          ? styles.formDetailContainerDark
          : styles.formDetailContainer
      }
    >
      <View style={styles.top}>
        <TouchableOpacity
          onPress={toggleStudyMode}
          style={styles.goBackIconContainer}
        >
          <Image
            style={styles.goBackIcon}
            source={
              darkEnabled
                ? require("../assets/images/metronome-plus.png")
                : require("../assets/images/plus-dark.png")
            }
          />
        </TouchableOpacity>
        <Text style={darkEnabled ? styles.formNameDark : styles.formName}>
          {currentFormName}
        </Text>
      </View>
      <TouchableOpacity
        onPress={toggleFormState}
        style={darkEnabled ? styles.startBtnDark : styles.startBtn}
      >
        <Text style={styles.startBtnTxt}>start</Text>
      </TouchableOpacity>
      <Text style={darkEnabled ? styles.paramTitleDark : styles.paramTitle}>
        Template Settings
      </Text>
      <View style={styles.row}>
        <View style={styles.block}>
          <Text style={darkEnabled ? styles.blockTitleDark : styles.blockTitle}>
            Start Speed
          </Text>
          <Text style={darkEnabled ? styles.blockTextDark : styles.blockText}>
            {formDetails.startGoalSpeed[0]} bpm
          </Text>
        </View>
        <View style={styles.block}>
          <Text style={darkEnabled ? styles.blockTitleDark : styles.blockTitle}>
            Interval
          </Text>
          <Text style={darkEnabled ? styles.blockTextDark : styles.blockText}>
            {formDetails.speedInterval} bpm
          </Text>
        </View>
        <View style={styles.block}>
          <Text style={darkEnabled ? styles.blockTitleDark : styles.blockTitle}>
            Goal Speed
          </Text>
          <Text style={darkEnabled ? styles.blockTextDark : styles.blockText}>
            {formDetails.startGoalSpeed[1]} bpm
          </Text>
        </View>
      </View>
      <View style={styles.row2}>
        <View style={styles.block}>
          <Text style={darkEnabled ? styles.blockTitleDark : styles.blockTitle}>
            Study Time
          </Text>
          <Text style={darkEnabled ? styles.blockTextDark : styles.blockText}>
            {new Date(formDetails.studyTime * 1000).toISOString().substr(11, 8)}
          </Text>
        </View>
        <View style={styles.block}>
          <Text style={darkEnabled ? styles.blockTitleDark : styles.blockTitle}>
            Break Time
          </Text>
          <Text style={darkEnabled ? styles.blockTextDark : styles.blockText}>
            {new Date(formDetails.breakTime * 1000).toISOString().substr(11, 8)}
          </Text>
        </View>
      </View>
      <Text style={darkEnabled ? styles.paramTitleDark : styles.paramTitle}>
        Parameters
      </Text>
      <View style={styles.paramContainer}>
        {currentParams.map((param) => (
          <Parameter param={param} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  formDetailContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
  },

  formDetailContainerDark: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
    padding: 20,
  },

  top: {
    flexDirection: "row",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    width: 350,
  },

  goBackIconContainer: {
    marginLeft: 15,
    position: "absolute",
    left: 0,
  },

  goBackIcon: {
    width: 25,
    height: 25,
    transform: [{ rotate: "45deg" }],
    zIndex: 20,
  },

  formName: {
    color: "#1C1C98",
    fontSize: 25,
    fontFamily: "Nunito-Bold",
    maxWidth: 200,
    textAlign: "center",
  },

  formNameDark: {
    color: "#fff",
    fontSize: 25,
    fontFamily: "Nunito-Bold",
    maxWidth: 200,
    textAlign: "center",
  },

  startBtn: {
    backgroundColor: "#1C1C98",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 50,
    paddingRight: 50,
    color: "#fff",
    borderRadius: 20,
    marginTop: 20,
  },

  startBtnDark: {
    backgroundColor: "#ffa072",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 50,
    paddingRight: 50,
    color: "#fff",
    borderRadius: 20,
    marginTop: 20,
  },

  startBtnTxt: {
    color: "#fff",
    textTransform: "uppercase",
  },

  paramTitle: {
    color: "#1C1C98",
    marginTop: 30,
    marginBottom: 20,
    fontSize: 20,
    fontFamily: "Nunito-Bold",
  },

  paramTitleDark: {
    color: "#fff",
    marginTop: 30,
    marginBottom: 20,
    fontSize: 20,
    fontFamily: "Nunito-Bold",
  },

  paramContainer: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
  },

  row: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    marginBottom: 20,
  },

  row2: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingRight: 40,
    paddingLeft: 40,
    marginBottom: 20,
  },

  block: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  blockTitle: {
    color: "#1c1c9b",
    fontFamily: "Nunito-Bold",
    // fontFamily: "Nunito",
    textAlign: "center",
    fontSize: 16,
  },

  blockTitleDark: {
    color: "#ffa072",
    fontFamily: "Nunito-Bold",
    // fontFamily: "Nunito",
    textAlign: "center",
    fontSize: 16,
  },

  blockText: {
    fontFamily: "Nunito",
    color: "#1a1a1a",
  },

  blockTextDark: {
    fontFamily: "Nunito",
    color: "#fff",
  },
});
