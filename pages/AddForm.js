import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import Info from "../components/Info";
import firestore, { firebase } from "@react-native-firebase/firestore";
import Slider from "@react-native-community/slider";
import Parameter from "../components/Parameter";
import Picker from "react-native-picker";
import { GlobalContext } from "../context/Context";
import ImagePicker from "react-native-image-crop-picker";
import MultiSlider, {
  CustomMarkerLeft,
} from "@ptomasroos/react-native-multi-slider";
import { useIsFocused } from "@react-navigation/native";
import storage from "@react-native-firebase/storage";

var widthThird = Dimensions.get("window").width / 3 - 20;

export default function AddForm({ navigation, route }) {
  const [selectedHours, setSelectedHours] = useState("H");
  const [selectedMinutes, setSelectedMinutes] = useState("M");
  const [selectedSeconds, setSelectedSeconds] = useState("S");
  const [breakHours, setBreakHours] = useState("H");
  const [breakMinutes, setBreakMinutes] = useState("M");
  const [breakSeconds, setBreakSeconds] = useState("S");
  const [pickerSelected, setPickerSelected] = useState("");
  const [studyError, setStudyError] = useState("");
  const [breakError, setBreakError] = useState("");
  const { darkEnabled, fetchU, userId } = useContext(GlobalContext);
  const [startGoalSpeed, setStartGoalSpeed] = useState([40, 240]);
  const [formName, setFormName] = useState("");
  const [inputTyping, setInputTyping] = useState(false);
  const [interval, setInterval] = useState(1);
  const [nameError, setNameError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState([]);
  const [selectedParams, setSelectedParams] = useState([]);
  const [paramsError, setParamsError] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [fetchFlag, setFetchFlag] = useState(true);

  const [formsAlreadyAdded, setFormsAlreadyAdded] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused == true) {
      let params = [];
      firestore()
        .collection("parameters")
        .where("autor_ref", "==", `users/${userId}`)
        .get()
        .then((querySnapshot) => {
          let forms = [];
          querySnapshot.forEach((documentSnapshot) => {
            params = [...documentSnapshot.data().parameters];
          });

          setParams(params);

          route.params.forms.forEach((form) => {
            forms.push(form.nome.toLowerCase());
          });

          setFormsAlreadyAdded(forms);

          setLoading(false);
        });
    }
  }, [isFocused, fetchFlag]);

  let data = [["H"], ["M"], ["S"]];
  for (var i = 0; i < data.length; i++) {
    for (var a = 0; a <= 60; a++) {
      data[i].push(a);
    }
  }

  const toggleFetch = () => {
    setFetchFlag(!fetchFlag);
  };

  const handleImageUpload = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then((image) => {
      let reference = storage().ref(
        `images/${Math.random()
          .toString(36)
          .substring(2, 15) +
          Math.random()
            .toString(36)
            .substring(2, 15)}.jpg`
      );

      reference.putFile(image.path).then(async () => {
        let url = await reference.getDownloadURL();
        setImageUrl(url);
      });
    });
  };

  const addParameters = (name, action) => {
    if (action == "add") {
      selectedParams.push(name);
    } else {
      setSelectedParams(
        selectedParams.filter((currentValue) => currentValue != name)
      );
    }

    console.log(selectedParams);
  };

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

  const submitNewForm = () => {
    if (formName == "" || formName == null || formName == " ") {
      setNameError("Insert a valid form name");
    } else if (formsAlreadyAdded.includes(formName.toLowerCase())) {
      setNameError("Form already exists");
    } else if (
      isNaN(selectedHours) ||
      isNaN(selectedMinutes) ||
      isNaN(selectedSeconds) ||
      (selectedHours == 0 && selectedMinutes == 0 && selectedSeconds == 0)
    ) {
      setStudyError("Insert a valid study Time");
    } else if (
      isNaN(breakHours) ||
      isNaN(breakMinutes) ||
      isNaN(breakSeconds) ||
      (breakHours == 0 && breakMinutes == 0 && breakSeconds == 0)
    ) {
      setBreakError("Insert a valid break time");
    } else if (
      selectedHours * 60 * 60 + selectedMinutes * 60 + selectedSeconds <
      30
    ) {
      setStudyError("Insert a study time longer than 30s");
    } else if (breakHours * 60 * 60 + breakMinutes * 60 + breakSeconds < 30) {
      setBreakError("Insert a break time longer than 30s");
    } else if (selectedParams.length == 0) {
      setParamsError("Select atleast one parameter");
    } else {
      setLoading(true);
      firestore()
        .collection("forms")
        .add({
          nome: formName,
          startGoalSpeed: startGoalSpeed,
          speedInterval: interval,
          studyTime:
            selectedHours * 60 * 60 + selectedMinutes * 60 + selectedSeconds,
          breakTime: breakHours * 60 * 60 + breakMinutes * 60 + breakSeconds,
          shared: false,
          autor: fetchU,
          autor_ref: `users/${userId}`,
          date: new Date(),
          parameters: selectedParams,
          author_name: `${formName}${userId}`,
          img: imageUrl,
        })
        .then(() => {
          setLoading(false);
          navigation.goBack();
        });
    }
  };

  if (loading) {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator
          size="large"
          color={darkEnabled ? "#ffa072" : "#1C1C98"}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={
        darkEnabled ? styles.addFormContainerDark : styles.addFormContainer
      }
      disableScrollViewPanResponder={true}
    >
      {/* header */}
      <View style={darkEnabled ? styles.postNavDark : styles.postNav}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.goBackIconContainer}
        >
          <Image
            style={styles.goBackIcon}
            source={require("../assets/images/goback-icon-8.png")}
          />
        </TouchableOpacity>
        <Text style={styles.navTitle}>NEW STUDY TEMPLATE</Text>
      </View>

      {/* main */}
      <View style={styles.addFormContent}>
        <View style={{ width: "100%" }}>
          <Text style={darkEnabled ? styles.formTitlesDark : styles.formTitles}>
            Template Name
          </Text>
          <TextInput
            maxLength={25}
            onChangeText={(text) => {
              setNameError(null);
              setFormName(text);
            }}
            placeholder="Ex: Edvard Grieg - Peer Gynt Suite"
            placeholderTextColor="#ddd"
            style={darkEnabled ? styles.formInputDark : styles.formInput}
          />
          <Text style={{ color: "red" }}>{nameError}</Text>
        </View>

        <View style={{ width: "100%", marginTop: 10, marginBottom: 0 }}>
          <Text style={darkEnabled ? styles.formTitlesDark : styles.formTitles}>
            Image
          </Text>
          <Text style={styles.formComment}>Optional</Text>

          <TouchableOpacity
            onPress={handleImageUpload}
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 320,
              height: 320,
              borderRadius: 20,
              marginRight: 3,
              marginLeft: 3,
              marginBottom: 6,
              marginTop: 10,
            }}
          >
            <ImageBackground
              imageStyle={{ borderRadius: 17 }}
              source={
                imageUrl
                  ? { uri: imageUrl }
                  : require("../assets/images/piano-8.png")
              }
              style={styles.formImage}
            />
            <View
              style={
                darkEnabled
                  ? styles.overlayDarkSelected
                  : styles.overlaySelected
              }
            >
              <Image
                style={styles.photoIcon}
                source={require("../assets/images/upload-profile-picture.png")}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ width: "100%", marginTop: 40 }}>
          <View style={styles.titleInfo}>
            <Text
              style={darkEnabled ? styles.formTitlesDark : styles.formTitles}
            >
              Speed Interval
            </Text>
            <Info
              text="Set the interval in which you wnat the metronome value to increase every time you complete a study time cycle."
              size={150}
            />
          </View>
          <Text style={darkEnabled ? styles.showNumberDark : styles.showNumber}>
            {interval}
          </Text>
          <Text style={darkEnabled ? styles.bpmDark : styles.bpm}>bpm</Text>
          <Slider
            style={{ width: 330, height: 40 }}
            minimumValue={1}
            maximumValue={10}
            step={1}
            minimumTrackTintColor={darkEnabled ? "#ffa072" : "#1C1C98"}
            maximumTrackTintColor={darkEnabled ? "#ddd" : "#1C1C98"}
            thumbTintColor={darkEnabled ? "#ffa072" : "#1C1C98"}
            onValueChange={(value) => {
              setInterval(parseInt(value));
            }}
          />
        </View>

        <View style={{ width: "100%", marginTop: 40 }}>
          <View style={styles.titleInfo}>
            <Text
              style={darkEnabled ? styles.formTitlesDark : styles.formTitles}
            >
              Start and Goal Speed
            </Text>
            <Info
              text="Set the speed you would like to start practicing in and the speed you would like to achieve by the end of your study session."
              size={150}
            />
          </View>
          <View style={{ width: "100%", marginLeft: 20, marginTop: 60 }}>
            <MultiSlider
              darkEnabled={darkEnabled}
              onValuesChangeFinish={(values) => {
                setStartGoalSpeed(values);
              }}
              values={[40, 240]}
              sliderLength={280}
              min={40}
              max={240}
              step={interval}
              style={{ width: "100%" }}
              enableLabel={true}
              minMarkerOverlapDistance={2}
              touchDimensions={{
                height: 100,
                width: 100,
                borderRadius: 15,
                slipDisplacement: 200,
              }}
            />
          </View>
        </View>

        <View style={{ width: "100%", marginTop: 40 }}>
          <View style={styles.titleInfo}>
            <Text
              style={darkEnabled ? styles.formTitlesDark : styles.formTitles}
            >
              Study Time
            </Text>
            <Info
              text="Set the amount of time you want to study for. Once the study timer reaches 0 the break time will begin. These timers will continue looping until you pause, stop or complete your study form."
              size={200}
            />
          </View>
          <TouchableOpacity
            onPress={showStudyPicker}
            style={darkEnabled ? styles.studyBtnDark : styles.studyBtn}
          >
            <Text style={styles.btnText}>
              {isNaN(selectedHours) ||
              isNaN(selectedMinutes) ||
              isNaN(selectedSeconds)
                ? "SET STUDY TIME"
                : `${selectedHours}H : ${selectedMinutes}M : ${selectedSeconds}S`}
            </Text>
          </TouchableOpacity>
          <Text style={{ color: "red" }}>{studyError}</Text>
        </View>
        <View style={{ width: "100%", marginTop: 40 }}>
          <View style={styles.titleInfo}>
            <Text
              style={darkEnabled ? styles.formTitlesDark : styles.formTitles}
            >
              Break Time
            </Text>
            <Info
              text="Set the amount of time you want your break to last for. Once the break timer reaches 0 the study time will begin and the metronome will increase in speed. These timers will continue looping until you pause, stop or complete your study form."
              size={250}
            />
          </View>
          <TouchableOpacity
            onPress={showBreakPicker}
            style={darkEnabled ? styles.breakBtnDark : styles.breakBtn}
          >
            <Text style={darkEnabled ? styles.btnTextDark : styles.btnText}>
              {isNaN(breakHours) || isNaN(breakMinutes) || isNaN(breakSeconds)
                ? "SET BREAK TIME"
                : `${breakHours}H : ${breakMinutes}M : ${breakSeconds}S`}
            </Text>
          </TouchableOpacity>
          <Text style={{ color: "red" }}>{breakError}</Text>
        </View>

        <View style={{ width: "100%", marginTop: 40 }}>
          <View style={styles.titleInfo}>
            <Text
              style={darkEnabled ? styles.formTitlesDark : styles.formTitles}
            >
              Parameters
            </Text>
            <Info
              text="Select which parameters you want to focus on while practicing this form. Each parameter will correspond to a block of study time."
              size={175}
            />
          </View>
          <View style={styles.myParameterContainer}>
            {/* Pedir ao professor Pedro um conjunto de parâmetros default */}
            {params.map((param, i) => {
              return (
                <Parameter
                  key={i}
                  addParameters={addParameters}
                  name={param.name}
                  image={param.image}
                  widthThird={widthThird}
                  description={param.description}
                  toggleFetch={toggleFetch}
                />
              );
            })}

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AddParameter", {
                  params: params,
                  numberOfParams: params.length,
                });
              }}
              style={
                darkEnabled
                  ? styles.addParameterContainerDark
                  : styles.addParameterContainer
              }
            >
              <Image
                style={styles.addParameterCross}
                source={
                  darkEnabled
                    ? require("../assets/images/form-cross-white-8.png")
                    : require("../assets/images/form-cross-8.png")
                }
              />
            </TouchableOpacity>
            <Text style={{ color: "red" }}>{paramsError}</Text>
          </View>
        </View>

        <View style={{ width: "40%", marginTop: 5 }}>
          <TouchableOpacity
            onPress={submitNewForm}
            style={darkEnabled ? styles.btnSaveDark : styles.btnSave}
          >
            <Text style={styles.btnText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  formImage: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  addFormContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },

  addFormContainerDark: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },

  postNav: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#1C1C98",
    alignItems: "center",
    justifyContent: "center",
  },

  postNavDark: {
    flexDirection: "row",
    height: 60,
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

  navTitle: {
    color: "#fff",
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    marginLeft: "auto",
    marginRight: "auto",
    paddingRight: 15,
  },

  addFormContent: {
    padding: 20,
    alignItems: "center",
  },

  formTitles: {
    fontSize: 20,
    color: "#1C1C98",
    fontFamily: "Nunito-SemiBold",
    alignSelf: "flex-start",
  },

  formTitlesDark: {
    fontSize: 20,
    color: "#ffffff",
    fontFamily: "Nunito-SemiBold",
    alignSelf: "flex-start",
  },

  formInput: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#1C1C98",
    width: "100%",
    color: "#000",
  },

  formInputDark: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#ffa072",
    width: "100%",
    color: "#fff",
  },

  titleInfo: {
    flexDirection: "row",
  },

  showNumber: {
    alignSelf: "center",
    fontSize: 50,
    marginTop: 10,
    color: "#1C1C98",
  },

  showNumberDark: {
    alignSelf: "center",
    fontSize: 50,
    marginTop: 10,
    color: "#ffa072",
  },

  bpm: {
    color: "#1C1C98",
    alignSelf: "center",
    fontSize: 20,
    marginTop: -10,
    marginBottom: 10,
  },

  bpmDark: {
    color: "#fff",
    alignSelf: "center",
    fontSize: 20,
    marginTop: -10,
    marginBottom: 10,
  },

  studyBtn: {
    backgroundColor: "#1c1c98",
    padding: 13,
    alignItems: "center",
    borderRadius: 50,
    marginTop: 30,
  },

  studyBtnDark: {
    backgroundColor: "#ffa072",
    padding: 13,
    alignItems: "center",
    borderRadius: 50,
    marginTop: 30,
  },

  breakBtn: {
    backgroundColor: "#ef6663",
    padding: 13,
    alignItems: "center",
    borderRadius: 50,
    marginTop: 30,
  },

  breakBtnDark: {
    backgroundColor: "#ffffff",
    padding: 13,
    alignItems: "center",
    borderRadius: 50,
    marginTop: 30,
  },

  btnText: {
    color: "#fff",
    fontFamily: "Nunito-Bold",
  },

  btnTextDark: {
    color: "#ffa072",
    fontFamily: "Nunito-Bold",
  },

  btnSave: {
    color: "#fff",
    backgroundColor: "#1c1c98",
    padding: 13,
    alignItems: "center",
    borderRadius: 50,
    marginTop: 30,
  },

  btnSaveDark: {
    color: "#fff",
    backgroundColor: "#ffa072",
    padding: 13,
    alignItems: "center",
    borderRadius: 50,
    marginTop: 30,
  },

  myParameterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 0,
    marginTop: 40,
  },

  addParameterContainer: {
    width: widthThird,
    height: widthThird,
    padding: 15,
    borderColor: "#1C1C98",
    borderWidth: 3,
    borderRadius: 20,
    marginRight: 3,
    marginLeft: 3,
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  addParameterContainerDark: {
    width: widthThird,
    height: widthThird,
    padding: 15,
    borderColor: "#fff",
    borderWidth: 3,
    borderRadius: 20,
    marginRight: 3,
    marginLeft: 3,
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  addParameterCross: {
    width: "100%",
    height: "100%",
  },

  formComment: {
    color: "#bbb",
    fontSize: 15,
    fontStyle: "italic",
  },

  formCommentDark: {
    color: "#ddd",
    fontSize: 15,
    fontStyle: "italic",
  },

  formImage: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  overlaySelected: {
    position: "absolute",
    backgroundColor: "#1C1C98",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    opacity: 0.5,
  },

  overlayDarkSelected: {
    position: "absolute",
    backgroundColor: "#ffa072",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    opacity: 0.5,
  },

  photoIcon: {
    zIndex: 11,
    position: "absolute",
    height: 50,
    width: 50,
    top: "40%",
    left: "42%",
  },
});
