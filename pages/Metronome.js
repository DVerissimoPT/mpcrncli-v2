import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
// import BackgroundTimer from "react-native-background-timer";
// import setSelfAdjustingInterval from "self-adjusting-interval";
import Picker from 'react-native-picker';
import CircularSlider from 'rn-circular-slider';
import { Player, MediaStates } from '@react-native-community/audio-toolkit';
import { GlobalContext } from '../context/Context';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native-paper';

var Sound = require('react-native-sound');

Sound.setCategory('Playback');

var bpm;

export default function Metronome() {
  const {
    darkEnabled,
    formState,
    currentForm,
    changeFormSpeed,
    formSpeed,
    formBreak,
    setCurrentFormInterval,
    currentFormInterval,
    currentFormCycle,
    formPaused,
    canIncrement,
  } = useContext(GlobalContext);
  const [tempo, setTempo] = useState(60);
  const [input, setInput] = useState(false);
  const [timeSig, setTimeSig] = useState('4/4');
  const [metroState, setMetroState] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [step, setStep] = useState(1);
  const [minTempo, setMinTempo] = useState(40);
  const [maxTempo, setMaxTempo] = useState(240);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formState) {
      setLoading(true);
      firestore()
        .collection('forms')
        .where('author_name', '==', currentForm)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((documentSnapshot) => {
            console.log('form running');
            data = documentSnapshot._data;
            setCurrentFormInterval(data.speedInterval);

            if (formSpeed == null && currentFormCycle == 0) {
              changeFormSpeed(data.startGoalSpeed[0]);
            } else if (
              formSpeed != null &&
              !formBreak &&
              formSpeed < data.startGoalSpeed[1] &&
              canIncrement
            ) {
              changeFormSpeed(formSpeed + currentFormInterval);
            } else if (
              formSpeed !== null &&
              formSpeed >= data.startGoalSpeed[1]
            ) {
              changeFormSpeed(data.startGoalSpeed[1]);
            }

            setTempo(data.startGoalSpeed[0]);
            setStep(data.speedInterval);
            setMinTempo(data.startGoalSpeed[0]);
            setMaxTempo(data.startGoalSpeed[1]);

            if (!formBreak) {
              setMetroState(true);
            } else {
              setMetroState(false);
            }

            setLoading(false);
          });
        });
    } else {
      setTempo(60);
      setStep(1);
      setMinTempo(40);
      setMaxTempo(240);
      setFirstTime(true);
      setMetroState(false);
    }
  }, [formState, formBreak]);

  let a = 0;
  let data = [['1/4', '2/4', '3/4', '4/4', '5/4', '6/8', '7/8', '8/8']];

  if (metroState) {
    if (firstTime) {
      if (bpm) {
        bpm.stop();
      }
      bpm = new Sound(
        `bpm60_${timeSig.charAt(0)}_${timeSig.charAt(2)}.mp3`,
        Sound.MAIN_BUNDLE,
        (error) => {
          if (error) {
            console.log('failed to load the sound', error);
            return;
          }

          if (formState) {
            bpm.play();
            bpm.setSpeed(formSpeed / 60);
          } else {
            bpm.play();
            bpm.setSpeed(tempo / 60);
          }
          // if (formState) {
          //   changeFormSpeed(tempo);
          // }
          bpm.setNumberOfLoops(-1);
        }
      );

      setFirstTime(false);
    } else {
      if (bpm && !formState) {
        bpm.setSpeed(tempo / 60);
        bpm.setNumberOfLoops(-1);
      } else {
        bpm.setSpeed(formSpeed / 60);
        bpm.setNumberOfLoops(-1);
      }
    }
  } else {
    if (bpm) {
      bpm.stop();
    }
  }

  const toggleMetronome = () => {
    if (!firstTime) {
      setFirstTime(true);
    }
    setMetroState(!metroState);
  };

  const changeMetronome = (type) => {
    if (formState) {
      if (type == 'less') {
        if (formSpeed <= minTempo) {
          changeFormSpeed(minTempo);
        } else {
          changeFormSpeed(formSpeed - currentFormInterval);
        }
      } else {
        if (formSpeed >= maxTempo) {
          changeFormSpeed(maxTempo);
        } else {
          changeFormSpeed(formSpeed + currentFormInterval);
        }
      }
    } else {
      if (type == 'less') {
        if (tempo <= 40) {
          setTempo(40);
        } else {
          setTempo(tempo - 1);
        }
      } else {
        if (tempo >= 240) {
          setTempo(240);
        } else {
          setTempo(tempo + 1);
        }
      }
    }
  };

  function showPicker() {
    Picker.init({
      isLoop: false,
      pickerData: data,
      pickerConfirmBtnText: 'CONFIRM',
      pickerCancelBtnText: 'CANCEL',
      pickerTitleText: 'Select time signature',
      pickerConfirmBtnColor: [255, 255, 255, 1],
      pickerCancelBtnColor: [255, 255, 255, 1],
      pickerTitleColor: [255, 255, 255, 1],
      pickerToolBarBg: darkEnabled ? [255, 160, 114, 1] : [28, 28, 151, 1],
      pickerBg: [226, 226, 226, 1],
      pickerToolBarFontSize: 15,
      pickerFontColor: darkEnabled ? [255, 160, 114, 1] : [28, 28, 151, 1],
      pickerFontFamily: 'Nunito-Bold',
      selectedValue: ['4'],
      onPickerConfirm: (data) => {
        setTimeSig(data[0]);
        setFirstTime(true);
      },
      onPickerCancel: (data) => {
        console.log(data);
      },
      onPickerSelect: (data) => {
        console.log(data);
      },
    });
    Picker.show();
  }

  if (loading || (formState && formSpeed == null)) {
    return <ActivityIndicator />;
  }

  return (
    <View style={darkEnabled ? styles.darkContainer : styles.container}>
      <View
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <TouchableOpacity
          onPress={() => {
            changeMetronome('less');
          }}
        >
          <Image
            source={require('../assets/images/metronome-less.png')}
            style={{ height: 25, width: 25, marginRight: 5 }}
          />
        </TouchableOpacity>
        <CircularSlider
          step={step}
          min={minTempo}
          max={maxTempo}
          value={formState ? formSpeed : tempo}
          onChange={(value) => {
            if (formState) {
              changeFormSpeed(value);
            } else {
              setTempo(value);
            }
          }}
          contentContainerStyle={styles.contentContainerStyle}
          strokeWidth={10}
          buttonBorderColor={darkEnabled ? '#ff9f72' : '#1C1C98'}
          buttonFillColor='#fff'
          buttonStrokeWidth={10}
          openingRadian={Math.PI / 6}
          buttonRadius={15}
          linearGradient={
            darkEnabled
              ? [
                  { stop: '0%', color: '#ffc1a9' },
                  { stop: '100%', color: '#ff9f72' },
                ]
              : [
                  { stop: '0%', color: '#A495D6' },
                  { stop: '100%', color: '#1C1C98' },
                ]
          }
        >
          <Text style={darkEnabled ? styles.valueDark : styles.value}>
            {formState ? formSpeed : tempo}
          </Text>
        </CircularSlider>
        <TouchableOpacity
          onPress={() => {
            changeMetronome('plus');
          }}
        >
          <Image
            source={require('../assets/images/metronome-plus.png')}
            style={{ height: 25, width: 25, marginRight: 5 }}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={showPicker}
        style={
          darkEnabled ? styles.timeSignatureBtnDark : styles.timeSignatureBtn
        }
      >
        <Text style={styles.btnText}>{`Time Signature: ${timeSig}`}</Text>
      </TouchableOpacity>
      {!formBreak ? (
        <TouchableOpacity
          style={
            darkEnabled
              ? metroState
                ? {
                    width: 43,
                    padding: 10,
                    height: 43,
                    marginTop: 40,
                    backgroundColor: '#fff',
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }
                : {
                    width: 43,
                    padding: 10,
                    height: 43,
                    marginTop: 40,
                    backgroundColor: '#ff9f72',
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }
              : metroState
              ? {
                  width: 43,
                  padding: 10,
                  height: 43,
                  marginTop: 40,
                  backgroundColor: '#ed6663',
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }
              : {
                  width: 43,
                  padding: 10,
                  height: 43,
                  marginTop: 40,
                  backgroundColor: '#1C1C98',
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }
          }
          onPress={toggleMetronome}
        >
          <Image
            style={{ width: '82%', height: '90%' }}
            source={
              metroState
                ? darkEnabled
                  ? require('../assets/images/stop-timer-dark-8.png')
                  : require('../assets/images/stop-timer-8.png')
                : require('../assets/images/start-timer-8.png')
            }
          />
        </TouchableOpacity>
      ) : (
        false
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  darkContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },

  contentContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  value: {
    fontWeight: '500',
    fontFamily: 'Nunito-Bold',
    fontSize: 32,
    color: '#1C1C98',
  },

  valueDark: {
    fontWeight: '500',
    fontFamily: 'Nunito-Bold',
    fontSize: 32,
    color: '#ff9f72',
  },

  timeSignatureBtn: {
    backgroundColor: '#1C1C98',
    padding: 13,
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 15,
  },

  timeSignatureBtnDark: {
    backgroundColor: '#ff9f72',
    padding: 13,
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 15,
  },

  btnText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
  },
});
