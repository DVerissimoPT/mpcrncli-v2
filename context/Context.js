import React, { Component, createContext } from 'react';
import firestore, { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Cache } from 'react-native-cache';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { isObject } from 'lodash';
export const GlobalContext = createContext();

const cache = new Cache({
  namespace: 'mpc',
  policy: {
    maxEntries: 50000,
  },
  backend: AsyncStorage,
});

class GlobalContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userN: '',
      darkEnabled: false,
      scrollPosition: 0,
      scrollLim: false,
      fetchU: '',
      notificationsTimer: true,
      userId: '',
      studyMode: false,
      currentForm: '',
      formState: false,
      currentFormName: '',
      currentParams: [],
      hostInformation: {},
      userImg: null,
      loading: false,
      formSpeed: null,
      remainingTime: 0,
      formBreak: false,
      getTimeFlag: false,
      currentTimeParam: [],
      numberOfParamsAllowed: 0,
      currentFormCycle: 0,
      formStudyTime: 0,
      formBreakTime: 0,
      paramCycle: [],
      currentFormInterval: null,
      formPaused: null,
      canIncrement: true,
      sharedFormId: null,
      feedFetch: [],
      feedNeedsUp: false,
      userUId: '',

      followersList: [],
      username: '',
    };

    this.fetchUsername = this.fetchUsername.bind(this);
    this.fetchUserId = this.fetchUserId.bind(this);
    this.toggleNotificationsSettings = this.toggleNotificationsSettings.bind(
      this
    );
    this.toggleStudyMode = this.toggleStudyMode.bind(this);
    this.toggleFormState = this.toggleFormState.bind(this);
    this.setCurrentParams = this.setCurrentParams.bind(this);
    this.saveHostInfo = this.saveHostInfo.bind(this);
    this.saveFeedArr = this.saveFeedArr.bind(this);
    this.changeFormSpeed = this.changeFormSpeed.bind(this);
    this.setFormRemaining = this.setFormRemaining.bind(this);
    this.toggleBreak = this.toggleBreak.bind(this);
    this.getTime = this.getTime.bind(this);
    this.triggerGetTime = this.triggerGetTime.bind(this);
    this.resetTimeStamps = this.resetTimeStamps.bind(this);
    this.addToCurrentFormCycle = this.addToCurrentFormCycle.bind(this);
    this.setFormTimes = this.setFormTimes.bind(this);
    this.setCurrentFormInterval = this.setCurrentFormInterval.bind(this);
    this.changeFormSpeed = this.changeFormSpeed.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.setFeedNeedsUp = this.setFeedNeedsUp.bind(this);
    // this.letIncrement = this.letIncrement.bind(this);
  }

  saveHostInfo = (obj) => {
    this.setState({
      hostInformation: obj,
    });
  };

  setFeedNeedsUp = (bool) => {
    this.setState({
      feedNeedsUp: bool,
    });
  };

  saveFeedArr = (arr) => {
    this.setState({
      feedFetch: [...arr],
    });
  };

  logCache = async () => {
    console.log('context: logCache');
    return await cache.get('theme');
  };

  saveThemeLight = async () => {
    console.log('context: saveThemeLight');
    await cache.set('theme', 'light');
    console.log('cache light');
  };

  saveThemeDark = async () => {
    console.log('context: saveThemeDark');
    await cache.set('theme', 'dark');
    console.log('cache dark');
  };

  setCurrentFormInterval(interval) {
    console.log('context: setCurrentFormInterval');
    this.setState({
      currentFormInterval: interval,
    });
  }

  getTime(time) {
    console.log('context: getTime');
    if (this.state.currentTimeParam.length < this.state.numberOfParamsAllowed) {
      this.setState({
        currentTimeParam: [...this.state.currentTimeParam, time],
      });

      console.log(this.state.currentTimeParam);
    }
  }

  // letIncrement() {
  //   this.setState({
  //     canIncrement: true,
  //   });
  // }

  handlePause() {
    console.log('context: handlePause');
    if (this.state.formPaused === null) {
      this.setState({
        formPaused: false,
        formBreak: !this.state.formBreak,
        canIncrement: false,
      });
    } else {
      this.setState({
        formPaused: !this.state.formPaused,
        formBreak: !this.state.formBreak,
        canIncrement: false,
      });
    }
  }

  triggerGetTime(paramNum) {
    console.log('context: triggerGetTime');
    this.setState({
      numberOfParamsAllowed: paramNum + 1,
      paramCycle: [...this.state.paramCycle, this.state.currentFormCycle],
    });
  }

  setCurrentParams = (params) => {
    console.log('context: setCurrentParams');
    this.setState({
      currentParams: params.sort((a, b) => a > b),
    });
  };

  addToCurrentFormCycle = () => {
    console.log('context: addToCurrentFormCycle');
    this.setState({
      currentFormCycle: this.state.currentFormCycle + 1,
    });
  };

  toggleStudyMode = (name, id, shared) => {
    console.log('context: toggleStudyTime');
    if (shared == null) {
      this.setState({
        studyMode: !this.state.studyMode,
        currentForm: `${name}${id}`,
        currentFormName: name,
        sharedFormId: shared,
      });
    } else {
      this.setState({
        studyMode: !this.state.studyMode,
        currentForm: `${name}${shared}`,
        currentFormName: name,
        sharedFormId: shared,
      });
    }
  };

  toggleFormState = () => {
    console.log('context: toggleFormState');
    this.setState({
      formBreak: false,
      formState: !this.state.formState,
    });
  };

  resetTimeStamps = () => {
    console.log('context: resetTimeStamps');
    this.setState({
      currentTimeParam: [],
      numberOfParamsAllowed: 0,
      paramCycle: [],
      formSpeed: null,
      currentFormCycle: 0,
      canIncrement: true,
      formPaused: null,
      sharedFormId: null,
    });
  };

  setFormTimes = (study, pause) => {
    console.log('context: setFormTimes');
    this.setState({
      formStudyTime: study,
      formBreakTime: pause,
    });
  };

  fetchUsername = () => {
    console.log('context: fetchUsername');
    const user = firebase.auth().currentUser;
    let email = user.email;

    this.setState({
      userUId: user.uid,
    });

    firestore()
      .collection('users')
      .where('email', '==', email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          this.setState({
            userId: documentSnapshot.id,
            username: documentSnapshot.username,
            userImg: documentSnapshot._data.profilePic,
            fetchU: documentSnapshot._data.email,
          });
        });
      });

    return email;
  };

  fetchUserId = () => {};

  toggleNotificationsSettings(bool) {
    console.log('context: toggleNotificationsSettings');
    this.setState({
      notificationsTimer: bool,
    });
  }

  changeFormSpeed(speed, add) {
    console.log('context: changeFormSpeed');
    if (add) {
      this.setState({
        formSpeed: this.state.formSpeed + add,
      });
    } else {
      this.setState({
        formSpeed: speed,
      });
    }
  }

  setFormRemaining(time) {
    console.log('context: setFormRemaining');
    if (time != this.state.remainingTime) {
      this.setState({
        remainingTime: time,
      });
    }
  }

  componentDidMount() {
    console.log('context: componentDidMount');
    const user = firebase.auth().currentUser;
    let email = user.email;

    this.fetchUsername();

    this.setState({
      //loading: true,
    });

    this.logCache().then((value) => {
      if (value == 'dark') {
        this.setState({ darkEnabled: true });
        this.props.setDarkEnabledApp(true);
      } else {
        this.setState({ darkEnabled: false });
        this.props.setDarkEnabledApp(false);
      }
    });

    console.log(this.state.userId);

    const subscribeFollowers = firestore()
      .collection('users')
      .where('email', '==', email)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          if(documentSnapshot._data.following){
            this.setState({
              followersList: [
                ...documentSnapshot._data.following,
                this.state.userId,
              ],
            });
          }
        });
      });
  }

  componentDidUpdate(prevState) {
    console.log('context: componentDidUpdate');
    if (this.state.userId != prevState.userId && this.state.userId != '') {
      firestore()
        .collection('parameters')
        .where('autor_ref', '==', `users/${this.state.userId}`)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size == 0 || !querySnapshot) {
            firestore()
              .collection('parameters')
              .add({
                autor_ref: `users/${this.state.userId}`,
                parameters: [
                  {
                    name: 'Posture',
                    image:
                      'https://images.unsplash.com/photo-1552422535-c45813c61732?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
                    description: 'Train your posture',
                  },
                  {
                    name: 'Left Hand',
                    image:
                      'https://images.unsplash.com/photo-1552422535-c45813c61732?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
                    description: 'Train your left hand',
                  },
                  {
                    name: 'Right Hand',
                    image:
                      'https://images.unsplash.com/photo-1552422535-c45813c61732?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
                    description: 'Train your right hand',
                  },
                  {
                    name: 'Breathing',
                    image:
                      'https://images.unsplash.com/photo-1552422535-c45813c61732?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
                    description: 'Train your breathing',
                  },
                  {
                    name: 'All Dynamics',
                    image:
                      'https://images.unsplash.com/photo-1552422535-c45813c61732?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
                    description: 'Train everything',
                  },
                ],
              });
          }
        });
    }
  }

  toggleBreak = () => {
    console.log('context: toggleBreak');
    this.setState({
      formBreak: !this.state.formBreak,
      canIncrement: true,
    });
  };

  toggleTheme = () => {
    console.log('context: toggleTheme');
    this.setState({ darkEnabled: !this.state.darkEnabled });
    this.props.setDarkEnabledApp(!this.props.darkEnabledApp);

    if (this.state.darkEnabled) {
      this.saveThemeLight();
    } else {
      this.saveThemeDark();
    }
  };

  togglePostsScrolled = (e) => {
    console.log('context: togglePostsScrolled');
    this.setState({ scrollPosition: e.nativeEvent.contentOffset.y });
  };

  render() {
    if (this.state.loading || this.state.fetchU == '') {
      return <ActivityIndicator />;
    }

    return (
      <GlobalContext.Provider
        value={{
          ...this.state,
          toggleTheme: this.toggleTheme,
          setFeedNeedsUp: this.setFeedNeedsUp,
          togglePostsScrolled: this.togglePostsScrolled,
          fetchUsername: this.fetchUsername,
          fetchUserId: this.fetchUserId,
          toggleNotificationsSettings: this.toggleNotificationsSettings,
          toggleStudyMode: this.toggleStudyMode,
          toggleFormState: this.toggleFormState,
          setCurrentParams: this.setCurrentParams,
          saveHostInfo: this.saveHostInfo,
          saveFeedArr: this.saveFeedArr,
          changeFormSpeed: this.changeFormSpeed,
          setFormRemaining: this.setFormRemaining,
          toggleBreak: this.toggleBreak,
          getTime: this.getTime,
          triggerGetTime: this.triggerGetTime,
          resetTimeStamps: this.resetTimeStamps,
          addToCurrentFormCycle: this.addToCurrentFormCycle,
          setFormTimes: this.setFormTimes,
          setCurrentFormInterval: this.setCurrentFormInterval,
          handlePause: this.handlePause,
          // letIncrement: this.letIncrement,
          removeParameter: this.removeParameter,
          scrollToTop: this.scrollToTop,
          isBarVisible: this.props.isBarVisible,
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}

export default GlobalContextProvider;
