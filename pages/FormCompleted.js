import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { GlobalContext } from "../context/Context";
import firestore, { firebase } from "@react-native-firebase/firestore";
import { auto } from "async";

import ParameterStats from "../components/ParameterStats";
import {
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";

export default function FormCompleted({ navigation }) {
  const {
    darkEnabled,
    currentParams,
    currentTimeParam,
    toggleFormState,
    resetTimeStamps,
    formState,
    formStudyTime,
    currentFormCycle,
    paramCycle,
    currentFormName,
  } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);

  if (loading) {
    <ActivityIndicator />;
  }

  return (
    <ScrollView
      style={
        darkEnabled ? styles.completeContainerDark : styles.completeContainer
      }
    >
      <View style={styles.completeContent}>
        <Image
          style={styles.topImg}
          source={
            darkEnabled
              ? require("../assets/images/form-complete-dark.png")
              : require("../assets/images/form-complete.png")
          }
        />
        <Text
          style={
            darkEnabled ? styles.completedTitleDark : styles.completedTitle
          }
        >
          Study Completed!
        </Text>
        <Text
          style={
            darkEnabled
              ? styles.completedSubTitleDark
              : styles.completedSubTitle
          }
        >
          Congratulations, you've completed the form "{currentFormName}"
        </Text>
        <Text style={darkEnabled ? styles.totalTimeDark : styles.totalTime}>
          {currentTimeParam.length > 0
            ? new Date(
                (currentFormCycle * formStudyTime +
                  currentTimeParam[currentTimeParam.length - 1]) *
                  1000
              )
                .toISOString()
                .substr(11, 8)
            : false}
        </Text>
        {currentTimeParam.map((param, i) => {
          return (
            <ParameterStats
              param={currentParams[i]}
              time={paramCycle[i] * formStudyTime + currentTimeParam[i]}
              lastTime={
                currentTimeParam[i - 1]
                  ? paramCycle[i - 1] * formStudyTime + currentTimeParam[i - 1]
                  : 0
              }
              // cycle={paramCycle[i]}
              //Resolver o problema do form cycle ^
            />
          );
        })}
        <TouchableOpacity
          style={darkEnabled ? styles.shareBtnDark : styles.shareBtn}
        >
          <Text style={styles.shareTxt}>share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            resetTimeStamps();
          }}
          style={{ marginTop: 20 }}
        >
          <Text style={darkEnabled ? styles.closeDark : styles.colse}>
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  completeContainer: {
    backgroundColor: "#fff",
  },

  completeContainerDark: {
    backgroundColor: "#1a1a1a",
  },

  completeContent: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    paddingBottom: 30,
  },

  topImg: {
    width: 150,
    height: 150,
  },

  completedTitle: {
    marginTop: 20,
    fontFamily: "Nunito-Bold",
    color: "#1c1c9b",
    fontSize: 35,
  },

  completedTitleDark: {
    marginTop: 20,
    fontFamily: "Nunito-Bold",
    color: "#ffa072",
    fontSize: 35,
  },

  completedSubTitle: {
    marginTop: 20,
    fontFamily: "Nunito",
    color: "#191919",
    fontSize: 15,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: "center",
  },

  completedSubTitleDark: {
    marginTop: 20,
    fontFamily: "Nunito",
    color: "#ddd",
    fontSize: 15,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: "center",
  },

  totalTime: {
    color: "#1c1c9b",
    fontFamily: "Nunito-Bold",
    fontSize: 50,
    marginTop: 30,
  },

  totalTimeDark: {
    color: "#ffa072",
    fontFamily: "Nunito-Bold",
    fontSize: 50,
    marginTop: 30,
  },

  totalTime: {
    color: "#1c1c9b",
    fontFamily: "Nunito-Bold",
    fontSize: 50,
    marginTop: 30,
  },

  shareBtn: {
    backgroundColor: "#1C1C98",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 50,
    paddingRight: 50,
    color: "#fff",
    borderRadius: 20,
    marginTop: 40,
  },

  shareBtnDark: {
    backgroundColor: "#ffa072",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 50,
    paddingRight: 50,
    color: "#fff",
    borderRadius: 20,
    marginTop: 40,
  },

  shareTxt: {
    color: "#fff",
    textTransform: "uppercase",
    fontFamily: "Nunito-Bold",
  },

  close: {
    color: "#1a1a1a",
  },

  closeDark: {
    color: "#fff",
  },
});
