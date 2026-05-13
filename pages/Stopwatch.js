import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  Animated,
  ActivityIndicator,
} from "react-native";
import Info from "../components/Info";
import { globalStyles } from "../styles/GlobalStyles";
import Picker from "react-native-picker";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { GlobalContext } from "../context/Context";
import PushNotification from "react-native-push-notification";
import BackgroundTimer from "react-native-background-timer";
import firestore, { firebase } from "@react-native-firebase/firestore";

export default function Stopwatch() {
  const {
    darkEnabled,
    formState,
    currentForm,
    notificationsTimer,
    setFormRemaining,
    toggleBreak,
    getTimeFlag,
    getTime,
    setFormTimes,
    addToCurrentFormCycle,
    changeFormSpeed,
    currentFormInterval,
    formPaused,
  } = useContext(GlobalContext);
  const [selectedHours, setSelectedHours] = useState("H");
  const [selectedMinutes, setSelectedMinutes] = useState("M");
  const [selectedSeconds, setSelectedSeconds] = useState("S");
  const [breakHours, setBreakHours] = useState("H");
  const [breakMinutes, setBreakMinutes] = useState("M");
  const [breakSeconds, setBreakSeconds] = useState("S");
  const [pickerSelected, setPickerSelected] = useState("");
  const [timerOn, setTimerOn] = useState(true);
  const [studyState, setStudyState] = useState(true);
  const [studySeconds, setStudySeconds] = useState(0);
  const [pauseSeconds, setPauseSeconds] = useState(0);
  const [studyError, setStudyError] = useState("");
  const [breakError, setBreakError] = useState("");
  const [loading, setLoading] = useState(false);

  let data = [["H"], ["M"], ["S"]];
  for (var i = 0; i < data.length; i++) {
    for (var a = 0; a <= 60; a++) {
      data[i].push(a);
    }
  }

  useEffect(() => {
    console.log("set");
    console.log(formPaused);
    if (formState) {
      setLoading(true);
      firestore()
        .collection("forms")
        .where("author_name", "==", currentForm)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((documentSnapshot) => {
            data = documentSnapshot._data;
            console.log(data);
            setStudySeconds(data.studyTime);
            setPauseSeconds(data.breakTime);
            setFormTimes(data.studyTime, data.breakTime);
            setTimerOn(false);
            setStudyState(true);
            setLoading(false);
          });
        });
    } else {
      setTimerOn(true);
      setStudyState(false);
      setLoading(false);
    }
  }, [formState]);

  function showStudyPicker() {
    Picker.init({
      isLoop: true,
      pickerData: data,
      pickerConfirmBtnText: "CONFIRM",
      pickerCancelBtnText: "CANCEL",
      pickerTitleText: "",
      pickerConfirmBtnColor: [255, 255, 255, 1],
      pickerCancelBtnColor: [255, 255, 255, 1],
      pickerTitleColor: [255, 255, 255, 1],
      pickerToolBarBg: darkEnabled ? [255, 160, 114, 1] : [28, 28, 151, 1],
      pickerBg: [226, 226, 226, 1],
      pickerToolBarFontSize: 15,
      pickerFontColor: darkEnabled ? [255, 160, 114, 1] : [28, 28, 151, 1],
      pickerFontFamily: "Nunito-Bold",
      selectedValue: ["H"],
      onPickerConfirm: (data) => {
        data[0] === "H" ? setSelectedHours(0) : setSelectedHours(data[0]);
        data[1] === "M" ? setSelectedMinutes(0) : setSelectedMinutes(data[1]);
        data[2] === "S" ? setSelectedSeconds(0) : setSelectedSeconds(data[2]);
        console.log(selectedHours, selectedMinutes, selectedSeconds);
        setStudyError("");
      },
      onPickerCancel: (data) => {
        console.log(data);
      },
      onPickerSelect: (data) => {
        console.log(data);
      },
    });
    Picker.show();
    setPickerSelected("study");
  }

  const toggleTimer = () => {
    if (
      isNaN(selectedHours) ||
      isNaN(selectedMinutes) ||
      isNaN(selectedSeconds) ||
      (selectedHours == 0 && selectedMinutes == 0 && selectedSeconds == 0)
    ) {
      console.log("insert a valid study time");
      setStudyError("Insert a valid study time");
    } else if (
      isNaN(breakHours) ||
      isNaN(breakMinutes) ||
      isNaN(breakSeconds) ||
      (breakHours == 0 && breakMinutes == 0 && breakSeconds == 0)
    ) {
      setBreakError("Insert a valid break time");
    } else {
      setStudySeconds(
        selectedHours * 60 * 60 + selectedMinutes * 60 + selectedSeconds
      );

      setPauseSeconds(breakHours * 60 * 60 + breakMinutes * 60 + breakSeconds);
      console.log(`study: ${studySeconds} , pause: ${pauseSeconds}`);

      console.log(studySeconds);
      setTimerOn(!timerOn);

      setStudyState(!studyState);
      console.log(timerOn);
    }
  };

  const resetBreakTimer = () => {
    setBreakHours("H");
    setBreakMinutes("M");
    setBreakSeconds("S");
  };

  const resetStudyTimer = () => {
    setSelectedHours("H");
    setSelectedMinutes("M");
    setSelectedSeconds("S");
  };

  function showBreakPicker() {
    Picker.init({
      isLoop: true,
      pickerData: data,
      pickerConfirmBtnText: "CONFIRM",
      pickerCancelBtnText: "CANCEL",
      pickerTitleText: "",
      pickerConfirmBtnColor: [255, 255, 255, 1],
      pickerCancelBtnColor: [255, 255, 255, 1],
      pickerTitleColor: [255, 255, 255, 1],
      pickerToolBarBg: darkEnabled ? [255, 160, 114, 1] : [237, 102, 99, 1],
      pickerBg: [226, 226, 226, 1],
      pickerToolBarFontSize: 15,
      pickerFontColor: darkEnabled ? [255, 160, 114, 1] : [237, 102, 99, 1],
      pickerFontFamily: "Nunito-Bold",
      selectedValue: ["H"],
      onPickerConfirm: (data) => {
        data[0] === "H" ? setBreakHours(0) : setBreakHours(data[0]);
        data[1] === "M" ? setBreakMinutes(0) : setBreakMinutes(data[1]);
        data[2] === "S" ? setBreakSeconds(0) : setBreakSeconds(data[2]);
        setBreakError("");
      },
      onPickerCancel: (data) => {
        console.log(data);
      },
      onPickerSelect: (data) => {
        console.log(data);
      },
    });

    Picker.show();
    setPickerSelected("break");
  }

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View
      style={
        darkEnabled ? styles.stopwatchContainerDark : styles.stopwatchContainer
      }
    >
      {timerOn ? (
        <View>
          <View style={styles.studyTimeContainer}>
            <View style={styles.row}>
              <Text
                style={
                  darkEnabled
                    ? styles.stopwatchTitlesDark
                    : styles.stopwatchTitles
                }
              >
                Study Time
              </Text>
              <Info
                text="Set the amount of time you want to study for. Once the study timer reaches 0 the break time will start. These timers will continue looping until you press the stop button."
                size={175}
              />
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                style={darkEnabled ? styles.studyBtnDark : styles.studyBtn}
                onPress={showStudyPicker}
              >
                <Text style={darkEnabled ? styles.btnTextDark : styles.btnText}>
                  {isNaN(selectedHours) ||
                  isNaN(selectedMinutes) ||
                  isNaN(selectedSeconds)
                    ? "SET STUDY TIME"
                    : `${selectedHours}H : ${selectedMinutes}M : ${selectedSeconds}S`}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={resetStudyTimer}
                style={
                  darkEnabled
                    ? styles.resetContainerStudyDark
                    : styles.resetContainerStudy
                }
              >
                <Image
                  style={styles.resetImageStudy}
                  source={require("../assets/images/reset-icon.png")}
                />
              </TouchableOpacity>
            </View>
            {studyError === "" ? (
              <Text />
            ) : (
              <Text style={{ color: "red" }}>{studyError}</Text>
            )}
          </View>

          <View style={styles.breakTimeContainer}>
            <View style={styles.row}>
              <Text
                style={
                  darkEnabled
                    ? styles.stopwatchBreakTitleDark
                    : styles.stopwatchBreakTitle
                }
              >
                Break Time
              </Text>
              <Info
                color="#ed6663"
                dif={true}
                text="Set the amount of time you want your break to last for. Once the break timer reaches 0 the study time will start. These timers will continue looping until you press the stop button."
                size={200}
              />
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                style={darkEnabled ? styles.breakBtnDark : styles.breakBtn}
                onPress={showBreakPicker}
              >
                <Text
                  style={darkEnabled ? styles.btnTextBreakDark : styles.btnText}
                >
                  {isNaN(breakHours) ||
                  isNaN(breakMinutes) ||
                  isNaN(breakSeconds)
                    ? "SET BREAK TIME"
                    : `${breakHours}H : ${breakMinutes}M : ${breakSeconds}S`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={resetBreakTimer}
                style={
                  darkEnabled
                    ? styles.resetContainerDark
                    : styles.resetContainer
                }
              >
                <Image
                  style={styles.resetImage}
                  source={
                    darkEnabled
                      ? require("../assets/images/reset-dark-8.png")
                      : require("../assets/images/reset-icon.png")
                  }
                />
              </TouchableOpacity>
            </View>
            {breakError === "" ? (
              <Text />
            ) : (
              <Text style={{ color: "red" }}>{breakError}</Text>
            )}
          </View>
        </View>
      ) : studyState ? (
        <View style={styles.circleContainer}>
          <Text
            style={
              darkEnabled
                ? styles.circleStudyTitleDark
                : styles.circleStudyTitle
            }
          >
            STUDY TIME
          </Text>
          <CountdownCircleTimer
            isPlaying={formPaused === null ? true : formPaused}
            trailColor={darkEnabled ? "#4d4d4d" : "#d9d9d9"}
            duration={studySeconds}
            colors={
              darkEnabled
                ? [["#ffa072", 0.7], ["#ffa072", 0.7], ["#fff"]]
                : [["#1c1c98", 0.7], ["#1c1c98", 0.7], ["#ed6663"]]
            }
            onComplete={() => {
              console.log("study complete");
              if (formState) {
                toggleBreak();
              }
              setStudyState(!studyState);
              if (notificationsTimer) {
                PushNotification.localNotification({
                  ticker: "My notification ticker",
                  title: "Study time is over!",
                  message: "Time to take a little break",
                  tag: "some_tag",
                  group: "timer group",
                  allowWhileIdle: true,
                  actions: ["Pause", "Stop"],
                });
              }

              // return [true, 3000];
            }}
          >
            {({ remainingTime, animatedColor }) => {
              setFormRemaining(Math.floor(remainingTime / 60) + 1);
              getTime(studySeconds - remainingTime);

              return (
                <Animated.Text
                  style={{
                    color: animatedColor,
                    fontSize: 25,
                    fontFamily: "Nunito-Bold",
                  }}
                >
                  {new Date(remainingTime * 1000).toISOString().substr(11, 8)}
                </Animated.Text>
              );
            }}
          </CountdownCircleTimer>
        </View>
      ) : (
        <View style={styles.circleContainer}>
          <View />
          <Text
            style={
              darkEnabled
                ? styles.circleBreakTitleDark
                : styles.circleBreakTitle
            }
          >
            BREAK TIME
          </Text>
          <CountdownCircleTimer
            trailColor={darkEnabled ? "#4d4d4d" : "#d9d9d9"}
            isPlaying={formPaused === null ? true : formPaused}
            duration={pauseSeconds}
            colors={
              darkEnabled
                ? [["#fff", 0.7], ["#fff", 0.7], ["#ffa072"]]
                : [["#ed6663", 0.7], ["#ed6663", 0.7], ["#1c1c98"]]
            }
            onComplete={() => {
              console.log("break complete");

              addToCurrentFormCycle();

              if (notificationsTimer) {
                PushNotification.localNotification({
                  ticker: "My notification ticker",
                  title: "Break time is over!",
                  message: "Time to go back to work!",
                  tag: "some_tag",
                  group: "timer group",
                  allowWhileIdle: true,
                  actions: ["Pause", "Stop"],
                });
              }

              setStudyState(!studyState);

              if (formState) {
                toggleBreak();
              }
            }}
          >
            {({ remainingTime, animatedColor }) => {
              setFormRemaining(Math.floor(remainingTime / 60) + 1);

              return (
                <Animated.Text
                  style={{
                    color: animatedColor,
                    fontSize: 25,
                    fontFamily: "Nunito-Bold",
                  }}
                >
                  {new Date(remainingTime * 1000).toISOString().substr(11, 8)}
                </Animated.Text>
              );
            }}
          </CountdownCircleTimer>
        </View>
      )}

      {formState ? (
        false
      ) : (
        <TouchableOpacity
          style={
            timerOn
              ? darkEnabled
                ? {
                    width: 43,
                    padding: 10,
                    height: 43,
                    marginTop: 40,
                    backgroundColor: "#ffa072",
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                  }
                : {
                    width: 43,
                    padding: 10,
                    height: 43,
                    marginTop: 40,
                    backgroundColor: "#1C1C98",
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                  }
              : darkEnabled
              ? {
                  width: 43,
                  padding: 10,
                  height: 43,
                  marginTop: 40,
                  backgroundColor: "#fff",
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }
              : {
                  width: 43,
                  padding: 10,
                  height: 43,
                  marginTop: 40,
                  backgroundColor: "#ed6663",
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }
          }
          onPress={toggleTimer}
        >
          <Image
            style={styles.startTimerIcon}
            source={
              timerOn
                ? require("../assets/images/start-timer-8.png")
                : darkEnabled
                ? require("../assets/images/stop-timer-dark-8.png")
                : require("../assets/images/stop-timer-8.png")
            }
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stopwatchContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  stopwatchContainerDark: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },

  circleContainer: {
    alignItems: "center",
  },

  circleStudyTitle: {
    marginBottom: 20,
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    color: "#1c1c98",
  },

  circleStudyTitleDark: {
    marginBottom: 20,
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    color: "#ffa072",
  },

  circleBreakTitle: {
    marginBottom: 20,
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    color: "#ed6663",
  },

  circleBreakTitleDark: {
    marginBottom: 20,
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    color: "#fff",
  },

  breakBtn: {
    backgroundColor: "#ed6663",
    padding: 13,
    alignItems: "center",
    borderRadius: 50,
  },

  breakBtnDark: {
    backgroundColor: "#fff",
    padding: 13,
    alignItems: "center",
    borderRadius: 50,
  },

  studyBtn: {
    backgroundColor: "#1C1C98",
    padding: 13,
    alignItems: "center",
    borderRadius: 50,
  },

  studyBtnDark: {
    backgroundColor: "#ffa072",
    padding: 13,
    alignItems: "center",
    borderRadius: 50,
  },

  btnText: {
    color: "#fff",
    fontFamily: "Nunito-Bold",
  },

  btnTextDark: {
    color: "#fff",
    fontFamily: "Nunito-Bold",
  },

  btnTextBreakDark: {
    color: "#ffa072",
    fontFamily: "Nunito-Bold",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  picker: {
    width: 50,
    marginLeft: -10,
    alignItems: "center",
    borderBottomColor: "#000",
    borderBottomWidth: 5,
  },

  stopwatchBreakTitle: {
    fontSize: 18,
    color: "#ed6663",
    fontFamily: "Nunito-SemiBold",
  },

  stopwatchBreakTitleDark: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Nunito-SemiBold",
  },

  stopwatchTitles: {
    fontSize: 18,
    color: "#1C1C98",
    fontFamily: "Nunito-SemiBold",
  },

  stopwatchTitlesDark: {
    fontSize: 18,
    color: "#ffa072",
    fontFamily: "Nunito-SemiBold",
  },

  breakTimeContainer: {
    marginTop: 40,
    alignItems: "center",
  },

  studyTimeContainer: {
    alignItems: "center",
  },

  resetContainer: {
    backgroundColor: "#ed6663",
    height: 43,
    width: 43,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginLeft: 10,
  },

  resetContainerDark: {
    backgroundColor: "#fff",
    height: 43,
    width: 43,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginLeft: 10,
  },

  resetContainerStudy: {
    backgroundColor: "#1C1C98",
    height: 43,
    width: 43,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginLeft: 10,
  },

  resetContainerStudyDark: {
    backgroundColor: "#ffa072",
    height: 43,
    width: 43,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginLeft: 10,
  },

  resetImage: {
    width: "100%",
    height: "86%",
  },

  resetImageStudy: {
    width: "100%",
    height: "86%",
  },

  startTimerIcon: {
    width: "82%",
    height: "90%",
  },
});
