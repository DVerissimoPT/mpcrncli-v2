import React, { useContext, useEffect, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from 'react-native';
import { GlobalContext } from '../context/Context';
import { stubFalse } from 'lodash';
import { TextInput, ActivityIndicator } from 'react-native-paper';
import firestore, { firebase } from '@react-native-firebase/firestore';

export default function StudyPage({ navigation }) {
  const {
    darkEnabled,
    toggleFormState,
    currentParams,
    userId,
    formSpeed,
    remainingTime,
    formBreak,
    triggerGetTime,
    formState,
    handlePause,
    formPaused,
    sharedFormId,
  } = useContext(GlobalContext);

  const [paramsDetail, setParamsDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paramNum, setParamNum] = useState(0);

  useEffect(() => {
    if (sharedFormId == null) {
      console.log('form normal');
      let params = [];
      firestore()
        .collection('parameters')
        .where('autor_ref', '==', `users/${userId}`)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((documentSnapshot) => {
            documentSnapshot._data.parameters.forEach((param) => {
              if (
                currentParams.includes(param.name) &&
                params.length < currentParams.length
              ) {
                params.push(param);
              }
            });
          });

          setParamsDetail(params.sort((a, b) => a.name > b.name));
          setLoading(false);
        });
    } else {
      console.log('shared form');
      let params = [];
      firestore()
        .collection('parameters')
        .where('autor_ref', '==', `users/${sharedFormId}`)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((documentSnapshot) => {
            documentSnapshot._data.parameters.forEach((param) => {
              if (
                currentParams.includes(param.name) &&
                params.length < currentParams.length
              ) {
                params.push(param);
              }
            });
          });

          console.log('params: ', params, 'contextparams: ', currentParams);

          setParamsDetail(params.sort((a, b) => a.name > b.name));
          setLoading(false);
        });
    }
  }, [formState]);

  const changeParameter = () => {
    if (paramNum < paramsDetail.length - 1) {
      setParamNum(paramNum + 1);
      triggerGetTime(paramNum);
    } else {
      triggerGetTime(paramNum);
      toggleFormState();
      navigation.navigate('FormCompleted');
    }
  };

  if (loading || (formState == true && formSpeed == null)) {
    return <ActivityIndicator />;
  }

  return (
    <View
      style={darkEnabled ? styles.containerStudyDark : styles.containerStudy}
    >
      <ImageBackground
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          resizeMode: 'cover',
          justifyContent: 'center',
          display: 'flex',
          alignItems: 'center',
        }}
        source={{ uri: paramsDetail[paramNum].image }}
      >
        <View
          style={
            darkEnabled
              ? styles.overlayDark
              : formBreak
              ? styles.overlayBreak
              : styles.overlay
          }
        />
        <View
          style={{
            zIndex: 3,
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={
              formBreak
                ? darkEnabled
                  ? {
                      color: '#fff',
                      fontWeight: 'bold',
                      position: 'absolute',
                      top: -80,
                    }
                  : {
                      color: '#000',
                      fontWeight: 'bold',
                      position: 'absolute',
                      top: -80,
                    }
                : {
                    color: '#fff',
                    fontWeight: 'bold',
                    position: 'absolute',
                    top: -80,
                  }
            }
          >
            {`${formSpeed}bpm`}
          </Text>

          <Text
            style={
              formBreak
                ? darkEnabled
                  ? {
                      color: '#fff',
                      fontWeight: 'bold',
                      position: 'absolute',
                      bottom: -80,
                    }
                  : {
                      color: '#000',
                      fontWeight: 'bold',
                      position: 'absolute',
                      bottom: -80,
                    }
                : {
                    color: '#fff',
                    fontWeight: 'bold',
                    position: 'absolute',
                    bottom: -80,
                  }
            }
          >
            {`Time remaining: ${remainingTime} min`}
          </Text>

          <Text
            style={
              formBreak
                ? darkEnabled
                  ? styles.parameterNameBreakDark
                  : styles.parameterNameBreak
                : styles.parameterName
            }
          >
            {formBreak && formPaused
              ? 'Break Time'
              : formBreak && !formPaused
              ? 'Form paused'
              : paramsDetail[paramNum].name}
          </Text>
          <Text
            style={
              formBreak
                ? darkEnabled
                  ? styles.parameterDescriptionBreakDark
                  : styles.parameterDescriptionBreak
                : styles.parameterDescription
            }
          >
            {formBreak && formPaused
              ? "Take a little time to rest, a new study cicle will begin shortly, we will warn you, don't worry. In the next study cicle we will increase the speed, feel free to adjust it in the metronome tab "
              : formBreak && !formPaused
              ? "The form is paused, click the 'Continue' button to continue "
              : paramsDetail[paramNum].description}
          </Text>

          <View style={styles.containerBtns}>
            {formBreak && !formPaused ? (
              <TouchableOpacity
                onPress={handlePause}
                style={darkEnabled ? styles.startBtnDark : styles.startBtn}
              >
                <Text style={styles.startBtnTxt}>Continue</Text>
              </TouchableOpacity>
            ) : !formBreak && (formPaused || formPaused == null) ? (
              <TouchableOpacity
                onPress={handlePause}
                style={darkEnabled ? styles.startBtnDark : styles.startBtn}
              >
                <Text style={styles.startBtnTxt}>Pause</Text>
              </TouchableOpacity>
            ) : (
              false
            )}

            <TouchableOpacity
              style={darkEnabled ? styles.startBtnDark : styles.startBtn}
              onPress={() => {
                triggerGetTime(paramNum);
                toggleFormState();
                navigation.navigate('FormCompleted', {
                  paramsDetail: paramsDetail,
                });
              }}
            >
              <Text style={styles.startBtnTxt}>stop</Text>
            </TouchableOpacity>
          </View>
          {formBreak ? (
            false
          ) : (
            <TouchableOpacity style={styles.checkBtn} onPress={changeParameter}>
              <Text style={styles.checkBtnTxt}>mark as completed</Text>
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStudy: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    position: 'relative',
  },

  containerStudyDark: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    position: 'relative',
  },

  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#1C1C98',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
    zIndex: 2,
  },

  overlayDark: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
    zIndex: 2,
  },

  overlayBreak: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8,
    zIndex: 2,
  },

  containerBtns: {
    flexDirection: 'row',
  },

  startBtn: {
    backgroundColor: '#ed6663',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    color: '#fff',
    borderRadius: 20,
    marginTop: 20,
    margin: 5,
    borderColor: '#ed6663',
    borderWidth: 2,
    borderRadius: 30,
  },

  startBtnDark: {
    backgroundColor: '#ffa072',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    color: '#fff',
    borderRadius: 20,
    marginTop: 20,
    margin: 5,
    borderColor: '#ffa072',
    borderWidth: 2,
    borderRadius: 30,
  },

  startBtnTxt: {
    fontFamily: 'Nunito-Bold',
    color: '#fff',
    textTransform: 'uppercase',
  },

  parameterName: {
    textAlign: 'center',
    fontSize: 45,
    color: '#fff',
    fontFamily: 'Nunito-Bold',
  },

  parameterNameBreak: {
    fontSize: 45,
    color: '#333',
    fontFamily: 'Nunito-Bold',
  },

  parameterNameBreakDark: {
    fontSize: 45,
    color: '#fff',
    fontFamily: 'Nunito-Bold',
  },

  parameterDescription: {
    margin: 20,
    fontFamily: 'Open-Sans',
    fontSize: 14,
    color: '#ddd',
    textAlign: 'center',
  },

  parameterDescriptionBreak: {
    margin: 20,
    fontFamily: 'Open-Sans',
    fontSize: 14,
    color: '#191919',
    textAlign: 'center',
  },

  parameterDescriptionBreakDark: {
    margin: 20,
    fontFamily: 'Open-Sans',
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },

  checkBtn: {
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 30,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 10,
  },

  checkBtnTxt: {
    textTransform: 'uppercase',
    fontFamily: 'Nunito-Bold',
    color: '#fff',
  },
});
