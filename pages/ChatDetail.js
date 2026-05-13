import React, { useContext } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { GiftedChat, Bubble, MessageImage } from 'react-native-gifted-chat';
import { GlobalContext } from '../context/Context';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import { Overlay } from 'react-native-elements';
import Form from '../components/Form';
import { ActivityIndicator } from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';

let context;
let unsubscribe;

var widthThird = Dimensions.get('window').width / 3 - 40;

class ChatDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      userId: '',
      roomId: '',
      userImg: '',
      fetch: false,
      url: null,
      image: null,
      isOverlayVisible: false,
      shareForms: [],
      shareFormsLoading: false,
      formAlreadyYoursError: false,
    };

    this.handleImage = this.handleImage.bind(this);
    this.removeImageUpload = this.removeImageUpload.bind(this);
    this.shareForm = this.shareForm.bind(this);
    this.closeOverlay = this.closeOverlay.bind(this);
  }

  static contextType = GlobalContext;

  handleImage = () => {
    ImagePicker.openPicker({
      cropping: false,
    }).then((image) => {
      this.setState({
        image: image.path,
      });
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
        this.setState({
          url: url,
        });
      });
    });
  };

  removeImageUpload = () => {
    this.setState({
      image: null,
      url: null,
    });
  };

  closeOverlay = () => {
    this.setState({
      isOverlayVisible: false,
    });
  };

  shareForm = () => {
    let formData = [];

    this.setState({
      isOverlayVisible: true,
      shareFormsLoading: true,
    });

    firestore()
      .collection('forms')
      .where('autor_ref', '==', `users/${context.userId}`)
      .get()
      .then((querySnapshot) => {
        console.log(querySnapshot.size);
        if (querySnapshot.size == 0) {
          this.setState({
            shareFormsLoading: false,
          });
        } else {
          querySnapshot.forEach((documentSnapshot) => {
            formData.push(documentSnapshot._data);
          });
        }

        this.setState({
          shareForms: formData,
          shareFormsLoading: false,
        });

        console.log(this.state.shareForms);
      });
  };

  componentDidMount() {
    console.log('fetch aqui filho');
    context = this.context;

    context.isBarVisible(false);

    this.props.route.params.setHeader(this.props.route.params.username);

    let roomArr = [context.fetchU, this.props.route.params.email];
    let roomArrSorted = roomArr.sort();
    let stringArr = `${roomArrSorted[0]}${roomArrSorted[1]}`;

    if (!this.state.fetch) {
      unsubscribe = firestore()
        .collection('rooms')
        .doc(`${stringArr}`)
        .collection('messages')
        .onSnapshot((querySnapshot) => {
          let messages = [];
          querySnapshot.forEach((documentSnapshot, i) => {
            if (documentSnapshot._data.message.length != 0) {
              if (documentSnapshot._data.message[0].quickReplies) {
                messages.push({
                  _id: documentSnapshot._data.message[0]._id,
                  createdAt: new Date(
                    documentSnapshot._data.message[0].createdAt._seconds * 1000
                  ),
                  image: documentSnapshot._data.message[0].form.img,
                  text: documentSnapshot._data.message[0].form.name,
                  user: documentSnapshot._data.message[0].user,
                  system: documentSnapshot._data.message[0].system,
                  quickReplies: documentSnapshot._data.message[0].quickReplies,
                  user: documentSnapshot._data.message[0].user,
                });
              } else {
                messages.push({
                  _id: documentSnapshot._data.message[0]._id,
                  createdAt: new Date(
                    documentSnapshot._data.message[0].createdAt._seconds * 1000
                  ),
                  image: documentSnapshot._data.message[0].image,
                  text: documentSnapshot._data.message[0].text,
                  user: documentSnapshot._data.message[0].user,
                  system: documentSnapshot._data.message[0].system,
                });
              }
            }

            if (messages.length > 0 && this.state.fetch == true) {
              this.setState({
                messages: messages.sort((a, b) => b.createdAt - a.createdAt),
                fetch: true,
              });
            }
          });
        });
    }

    if (this.state.roomId === '') {
      firestore()
        .collection('rooms')
        .doc(`${stringArr}`)
        .collection('messages')
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size === 0) {
            firestore()
              .collection('rooms')
              .doc(`${stringArr}`)
              .set({
                participants: [context.fetchU, this.props.route.params.email],
                unreadMessages: 0,
                lastMessageDate: new Date(),
              })
              .then(() => {
                firestore()
                  .collection('rooms')
                  .doc(`${stringArr}`)
                  .collection('messages')
                  .add({
                    message: [
                      {
                        _id: `${Math.floor(Math.random() * 99999)}-${Math.floor(
                          Math.random() * 99999
                        )}-${Math.floor(Math.random() * 99999)}-${Math.floor(
                          Math.random() * 99999
                        )}-${Math.floor(Math.random() * 99999)}`,
                        createdAt: new Date(),
                        text: `Say hi`,
                        system: true,
                      },
                    ],
                  });
              })
              .then(() => {
                this.setState({
                  userId: context.userId,
                  roomId: stringArr,
                  userImg: context.userImg,
                  messages: [],
                });
              });
          } else {
            if (
              context.fetchU != this.props.route.params.lastMessageSender &&
              this.state.fetch == false
            ) {
              firestore()
                .collection('rooms')
                .doc(`${stringArr}`)
                .update({
                  unreadMessages: 0,
                });
            }

            this.setState({
              fetch: true,
              userId: context.userId,
              roomId: stringArr,
              userImg: context.userImg,
            });
          }
        });
    }
  }

  componentWillUnmount() {
    unsubscribe();
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
      image: null,
      url: null,
    }));

    firestore()
      .collection('rooms')
      .doc(`${this.state.roomId}`)
      .collection('messages')
      .doc(messages[0]._id)
      .set({
        message: [
          {
            _id: messages[0]._id,
            createdAt: messages[0].createdAt,
            text: messages[0].text,
            user: messages[0].user,
            image: this.state.url,
            system: false,
          },
        ],
        name: context.fetchU,
        real: true,
        isForm: false,
      })
      .then(() => {
        firestore()
          .collection('rooms')
          .doc(`${this.state.roomId}`)
          .update({
            lastMessageSender: context.fetchU,
            lastMessage: messages[0].text,
            lastMessageDate: messages[0].createdAt,
            unreadMessages: firestore.FieldValue.increment(1),
          })
          .then(async () => {
            const receiver = firestore()
              .collection('users')
              .where('email', '==', this.props.route.params.email)
              .get();

            const sender = firestore()
              .collection('users')
              .where('email', '==', context.fetchU)
              .get();

            await messaging().sendToDevice(
              receiver.token,
              {
                data: {
                  owner: JSON.stringify(receiver),
                  user: JSON.stringify(sender),
                  text: messages[0].text,
                },
              },
              {
                priority: 'high',
              }
            );
          });
      });
  }

  render() {
    return (
      <>
        <Overlay
          style={{
            height: 200,
            margin: 0,
            padding: 0,
            backgroundColor: '#1a1a1a',
          }}
          isVisible={this.state.isOverlayVisible}
          onBackdropPress={() => {
            this.setState({
              isOverlayVisible: false,
            });
          }}
        >
          <View
            style={
              this.context.darkEnabled
                ? {
                    height: 400,
                    width: 300,
                    padding: 0,
                    backgroundColor: '#1a1a1a',
                  }
                : {
                    height: 400,
                    width: 300,
                    padding: 0,
                    margin: 0,
                    backgroundColor: '#fff',
                  }
            }
          >
            <Text
              style={
                this.context.darkEnabled
                  ? {
                      fontFamily: 'Nunito-Bold',
                      textAlign: 'center',
                      fontSize: 20,
                      color: '#ffa072',
                      marginTop: 10,
                    }
                  : {
                      fontFamily: 'Nunito-Bold',
                      textAlign: 'center',
                      fontSize: 20,
                      color: '#1c1c98',
                      marginTop: 10,
                    }
              }
            >
              Share Template
            </Text>
            <ScrollView>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginBottom: 40,
                  marginTop: 20,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {this.state.shareFormsLoading ? (
                  <ActivityIndicator />
                ) : this.state.shareForms.length == 0 ? (
                  <View>
                    <Text>You don't have forms to share</Text>
                  </View>
                ) : (
                  this.state.shareForms.map((form) => (
                    <Form
                      shared={false}
                      widthThird={widthThird}
                      name={form.nome}
                      img={form.img}
                      chatShare={true}
                      roomId={this.state.roomId}
                      userId={this.state.userId}
                      userImg={this.state.userImg}
                      closeOverlay={this.closeOverlay}
                    />
                  ))
                )}
              </View>
            </ScrollView>
          </View>
        </Overlay>
        <GiftedChat
          darkEnabled={this.context.darkEnabled}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          onQuickReply={(reply) => {
            firestore()
              .collection('rooms')
              .doc(this.state.roomId)
              .collection('messages')
              .doc(reply[0].messageId)
              .get()
              .then((querySnapshot) => {
                console.log(
                  querySnapshot._data.message[0].user._id,
                  this.context.userId
                );

                if (
                  querySnapshot._data.message[0].user._id != this.context.userId
                ) {
                  firestore()
                    .collection('rooms')
                    .doc(this.state.roomId)
                    .collection('messages')
                    .doc(reply[0].messageId)
                    .get()
                    .then((querySnapshot) => {
                      firestore()
                        .collection('forms')
                        .where(
                          'author_name',
                          '==',
                          querySnapshot._data.message[0].form.author_name
                        )
                        .get()
                        .then((querySnapshot) => {
                          querySnapshot.forEach((documentSnapshot) => {
                            firestore()
                              .collection('forms')
                              .add({
                                author_name: `${documentSnapshot._data.nome}${
                                  this.context.userId
                                }`,
                                autor: documentSnapshot._data.autor,
                                autor_ref: `users/${this.context.userId}`,
                                user_img: this.state.userImg,
                                breakTime: documentSnapshot._data.breakTime,
                                date: new Date(),
                                img: documentSnapshot._data.img,
                                nome: documentSnapshot._data.nome,
                                parameters: documentSnapshot._data.parameters,
                                shared: true,
                                speedInterval:
                                  documentSnapshot._data.speedInterval,
                                startGoalSpeed:
                                  documentSnapshot._data.startGoalSpeed,
                                studyTime: documentSnapshot._data.studyTime,
                              })
                              .then(() => {
                                firestore()
                                  .collection('rooms')
                                  .doc(this.state.roomId)
                                  .collection('messages')
                                  .doc(reply[0].messageId)
                                  .delete()
                                  .then(() => {
                                    firestore()
                                      .collection('rooms')
                                      .doc(this.state.roomId)
                                      .collection('messages')
                                      .add({
                                        message: [
                                          {
                                            _id: `${Math.floor(
                                              Math.random() * 99999
                                            )}-${Math.floor(
                                              Math.random() * 99999
                                            )}-${Math.floor(
                                              Math.random() * 99999
                                            )}-${Math.floor(
                                              Math.random() * 99999
                                            )}-${Math.floor(
                                              Math.random() * 99999
                                            )}`,
                                            createdAt: new Date(),
                                            text: `Form Added To Library`,
                                            system: true,
                                          },
                                        ],
                                      })
                                      .then(() => {
                                        firestore()
                                          .collection('rooms')
                                          .doc(this.state.roomId)
                                          .update({
                                            lastMessage:
                                              'Form added to library',
                                          });
                                      });
                                  });
                              });
                          });
                        });
                    });
                } else {
                  // Formulário é teu

                  this.setState({
                    formAlreadyYoursError: true,
                  });

                  setTimeout(() => {
                    this.setState({
                      formAlreadyYoursError: false,
                    });
                  }, 3000);
                }
              });
          }}
          renderActions={() => (
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={this.handleImage}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 5,
                }}
              >
                <Image
                  style={
                    this.context.darkEnabled
                      ? { height: 22, width: 30, tintColor: '#ffa072' }
                      : { height: 22, width: 30 }
                  }
                  source={require('../assets/images/insert-image-8.png')}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.shareForm}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 5,
                }}
              >
                <Image
                  style={
                    this.context.darkEnabled
                      ? { height: 22, width: 21, tintColor: '#ffa072' }
                      : { height: 22, width: 21 }
                  }
                  source={require('../assets/images/share-post-8.png')}
                />
              </TouchableOpacity>
            </View>
          )}
          user={{
            _id: this.state.userId,
            name: 'Ema Bonito',
            avatar: this.state.userImg,
          }}
        />

        {this.state.image ? (
          <View
            style={{
              width: '100%',
              height: 30,
              backgroundColor: 'green',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingLeft: 10,
            }}
          >
            <Text numberOfLines={1} style={{ color: '#fff', width: '80%' }}>
              {this.state.image}
            </Text>

            <TouchableOpacity onPress={this.removeImageUpload}>
              <Text
                style={{
                  color: '#fff',
                  paddingRight: 10,
                  fontWeight: 'bold',
                  fontSize: 20,
                }}
              >
                X
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          false
        )}

        {this.state.formAlreadyYoursError ? (
          <View
            style={{
              width: '100%',
              height: 30,
              backgroundColor: 'red',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingLeft: 10,
            }}
          >
            <Text numberOfLines={1} style={{ color: '#fff', width: '80%' }}>
              Form already in your library
            </Text>
          </View>
        ) : (
          false
        )}
      </>
    );
  }
}

export default ChatDetail;
