import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { GlobalContext } from "../context/Context";
import ImagePicker from "react-native-image-crop-picker";
import firestore, { firebase } from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import { FirebaseStorageTypes } from "@react-native-firebase/storage";
import { useScreens } from "react-native-screens";
// import { ScrollView } from "react-native-gesture-handler";

export default function EditProfile({ navigation, route }) {
  const { darkEnabled } = useContext(GlobalContext);
  const { fetchU } = useContext(GlobalContext);
  const { ref_user } = route.params;
  const { autor } = route.params;
  const { owner } = route.params;
  const { host_id } = route.params;
  const { profile } = route.params;
  const [currentImage, setCurrentImage] = useState(null);
  const [data, setData] = useState({
    bio: "",
    username: "",
    email: "",
    currentEmail: "",
    currentPassword: "",
    newPassword: "",
    confNewPassword: "",
  });
  const [hasOpened, setHasOpened] = useState(false);
  let user = firebase.auth().currentUser;

  if (hasOpened == false) {
    setData({
      bio: profile.bio,
      profilePic: profile.profilePic,
      username: profile.username,
      email: user.email,
      currentEmail: user.email,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confNewPassword: data.confNewPassword,
    });
    setHasOpened(true);
  }

  const handleImagePicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true,
    }).then((image) => {
      setCurrentImage(image.path);
    });
  };

  return (
    <ScrollView
      style={
        darkEnabled
          ? styles.editProfileContainerDark
          : styles.editProfileContainer
      }
    >
      {/* header */}
      <View style={darkEnabled ? styles.postNavDark : styles.postNav}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.goBackIconContainer}
        >
          <Image
            style={styles.goBackIcon}
            source={require("../assets/images/goback-icon-8.png")}
          />
        </TouchableOpacity>
        <Text style={styles.navTitle}>EDIT PROFILE</Text>
      </View>
      {/* main */}
      <TouchableOpacity
        onPress={handleImagePicker}
        style={styles.profilePicContainer}
      >
        <Image
          style={styles.profilePic}
          source={
            currentImage ? { uri: currentImage } : { uri: data.profilePic }
          }
        />
        <View
          style={
            darkEnabled
              ? styles.profilepicOverlayDark
              : styles.profilepicOverlay
          }
        />
        <Image
          style={styles.photoIcon}
          source={require("../assets/images/upload-profile-picture.png")}
        />
      </TouchableOpacity>

      {/* <View style={{ margin: 20 }}>
        <Text style={darkEnabled ? styles.editProfileTitleDark :styles.editProfileTitle}>Name</Text>
        <TextInput
          placeholder="Ema Bonito"
          placeholderTextColor="#aaa"
          style={darkEnabled ? styles.formInputDark : styles.formInput}
        />
      </View> */}
      <View style={{ margin: 20 }}>
        <Text
          style={
            darkEnabled ? styles.editProfileTitleDark : styles.editProfileTitle
          }
        >
          Username
        </Text>
        <TextInput
          defaultValue={profile.username}
          placeholderTextColor="#aaa"
          style={darkEnabled ? styles.formInputDark : styles.formInput}
          onChangeText={(text) => {
            setData({
              bio: data.bio,
              email: data.email,
              username: text,
              currentEmail: data.currentEmail,
              currentPassword: data.currentPassword,
              newPassword: data.newPassword,
              confNewPassword: data.confNewPassword,
            });
          }}
        />
      </View>
      <View style={{ margin: 20 }}>
        <Text
          style={
            darkEnabled ? styles.editProfileTitleDark : styles.editProfileTitle
          }
        >
          Bio
        </Text>
        <TextInput
          defaultValue={profile.bio}
          placeholderTextColor="#aaa"
          style={darkEnabled ? styles.formInputDark : styles.formInput}
          onChangeText={(text) => {
            setData({
              bio: text,
              email: data.email,
              username: data.username,
              currentEmail: data.currentEmail,
              currentPassword: data.currentPassword,
              newPassword: data.newPassword,
              confNewPassword: data.confNewPassword,
            });
          }}
        />
      </View>
      <View style={{ margin: 20 }}>
        <Text
          style={
            darkEnabled ? styles.editProfileTitleDark : styles.editProfileTitle
          }
        >
          Email
        </Text>
        <TextInput
          defaultValue={data.email}
          placeholderTextColor="#aaa"
          style={darkEnabled ? styles.formInputDark : styles.formInput}
          onChangeText={(text) => {
            setData({
              bio: data.bio,
              email: text,
              username: data.username,
              currentEmail: data.currentEmail,
              currentPassword: data.currentPassword,
              newPassword: data.newPassword,
              confNewPassword: data.confNewPassword,
            });
          }}
        />
      </View>
      <View style={{ margin: 20 }}>
        <Text
          style={
            darkEnabled ? styles.editProfileTitleDark : styles.editProfileTitle
          }
        >
          Current Password
        </Text>
        <TextInput
          placeholder="password"
          placeholderTextColor="#aaa"
          secureTextEntry={true}
          style={darkEnabled ? styles.formInputDark : styles.formInput}
          onChangeText={(text) => {
            setData({
              bio: data.bio,
              email: data.email,
              username: data.username,
              currentEmail: data.currentEmail,
              currentPassword: text,
              newPassword: data.newPassword,
              confNewPassword: data.confNewPassword,
            });
          }}
        />
      </View>
      <View style={{ margin: 20, flexDirection: "row" }}>
        <View style={{ width: "45%", marginRight: 30 }}>
          <Text
            style={
              darkEnabled
                ? styles.editProfileTitleDark
                : styles.editProfileTitle
            }
          >
            New Password
          </Text>
          <TextInput
            placeholder="password"
            textContentType="password"
            secureTextEntry={true}
            placeholderTextColor="#aaa"
            style={darkEnabled ? styles.formInputDark : styles.formInput}
            onChangeText={(text) => {
              setData({
                bio: data.bio,
                email: data.email,
                username: data.username,
                currentEmail: data.currentEmail,
                currentPassword: data.currentPassword,
                newPassword: text,
                confNewPassword: data.confNewPassword,
              });
            }}
          />
        </View>
        <View style={{ width: "45%", alignSelf: "flex-end" }}>
          <Text
            style={
              darkEnabled
                ? styles.editProfileTitleDark
                : styles.editProfileTitle
            }
          >
            Confirm Password
          </Text>
          <TextInput
            placeholder="password"
            textContentType="password"
            secureTextEntry={true}
            placeholderTextColor="#aaa"
            style={darkEnabled ? styles.formInputDark : styles.formInput}
            onChangeText={(text) => {
              setData({
                bio: data.bio,
                email: data.email,
                username: data.username,
                currentEmail: data.currentEmail,
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confNewPassword: text,
              });
            }}
          />
        </View>
      </View>
      <View
        style={{
          width: "40%",
          alignSelf: "center",
          marginBottom: 50,
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={darkEnabled ? styles.btnSaveDark : styles.btnSave}
          onPress={() => {
            let active = false;
            let queue = 0;
            let perm_change_posts=false;
            if(data.username != autor){
              perm_change_posts = true;
            }
            ref_user
              .update({ bio: data.bio, username: data.username })
              .then(() => {
                let user = firebase.auth().currentUser;
                if(perm_change_posts){
                  firestore().collection('posts').where('ref_user','==',ref_user).get().then((qs)=>{
                    qs.forEach((v)=>{
                      firestore().doc('posts/'+v.id).update({autor : data.username}).then(()=>{
                        
                      });
                    });
                  });
                }
                if (data.email !== data.currentEmail) {
                  /*they want to change email, therefore need re-auth
                valid current password*/
                  active = true;
                  queue++;
                  if (data.currentPassword !== "") {
                    let user = firebase.auth().currentUser;

                    let cred = firebase.auth.EmailAuthProvider.credential(
                      user.email,
                      data.currentPassword
                    );
                    user
                      .reauthenticateWithCredential(cred)
                      .then((r) => {
                        /*autenticacao sucesso*/

                        firestore()
                          .doc(
                            "users/" + ref_user["_documentPath"]["_parts"][1]
                          )
                          .update({ email: data.email })
                          .catch((e) => {
                            //data base update falhou
                            active = false;
                            queue--;
                            console.log(e);
                          })
                          .then(() => {
                            user
                              .updateEmail(data.email)
                              .catch((e) => {
                                //update Email falhou
                                active = false;
                                queue--;
                                console.log(e);
                              })
                              .then(() => {
                                active = false;
                                queue--;
                              });
                          });
                      })
                      .catch((e) => {
                        console.log(e);
                        active = false;
                        queue--;
                        /*autenticacao falhou*/
                      });
                  } else {
                    /*currentPassword nao foi inserida*/
                    active = false;
                    queue--;
                  }
                }
                if (data.newPassword !== "") {
                  /*they want to change password, therefore need re-auth
                 valid current password
                 matching new and confirm new password*/
                  queue++;
                  const run = function() {
                    if (active === true) {
                      setTimeout(run, 600);
                    } else {
                      active = true;
                      let user = firebase.auth().currentUser;
                      let cred = firebase.auth.EmailAuthProvider.credential(
                        user.email,
                        data.currentPassword
                      );
                      user
                        .reauthenticateWithCredential(cred)
                        .catch((e) => {
                          console.log(e);
                          active = false;
                          queue--;
                        })
                        .then(() => {
                          if (user.currentPassword !== "") {
                            if (data.newPassword === data.confNewPassword) {
                              user
                                .updatePassword(data.newPassword)
                                .catch((e) => {
                                  console.log(e);
                                  active = false;
                                  queue--;
                                  //erro mudança de password
                                })
                                .catch((e) => {
                                  console.log(e);
                                  active = false;
                                  queue--;
                                });
                            }
                          } else {
                            active = false;
                            queue--;
                            //currentPassword nao foi inserida
                          }
                        });
                    }
                  };
                  run();
                }
                if (currentImage) {
                  const run_img = function() {
                    if (active == true) {
                      setTimeout(run_img, 600);
                    } else {
                      active = true;
                      queue++;
                      const reference = firebase.storage().ref();
                      let task = reference
                        .child(
                          "images/" +
                            host_id +
                            Math.floor(Math.random() * 99999999) +
                            ".jpg"
                        )
                        .putFile(currentImage)
                        .then(async (ss) => {
                          await storage()
                            .ref(ss.metadata.fullPath)
                            .getDownloadURL()
                            .then((url) => {
                              ref_user
                                .update({
                                  profilePic: url,
                                })
                                .then(() => {
                                  active = false;
                                  queue--;
                                });
                            });
                        });
                    }
                  };
                  run_img();
                }
                const try_end = function() {
                  if (!active && queue == 0) {
                    navigation.navigate("Profile", {
                      ref_user: ref_user,
                      autor: autor,
                      host_id: host_id,
                    });
                  } else {
                    setTimeout(try_end, 600);
                  }
                };
                try_end();
              });
          }}
        >
          <Text style={styles.btnText}>SAVE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // blue "#1C1C98"
  // red "#ED6663"
  // dark "#1a1a1a"
  // orange "#ffa072"

  editProfileContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },

  editProfileContainerDark: {
    backgroundColor: "#1a1a1a",
    flex: 1,
  },

  postNav: {
    flexDirection: "row",
    height: 120,
    backgroundColor: "#1C1C98",
    justifyContent: "center",
    paddingTop: 30,
  },

  postNavDark: {
    flexDirection: "row",
    height: 120,
    backgroundColor: "#ffa072",
    justifyContent: "center",
    paddingTop: 30,
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

  profilePicContainer: {
    width: 150,
    height: 150,
    borderRadius: 100,
    shadowColor: "#000",
    alignSelf: "center",
    // flex:1,
    // alignItems:"center",
    // justifyContent:"center",
    marginTop: -50,
    shadowOffset: {
      width: 6,
      height: 6,
    },
  },

  profilePic: {
    borderColor: "#fff",
    borderWidth: 7,
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: -30,
  },

  profilepicOverlay: {
    borderColor: "#fff",
    borderWidth: 7,
    height: "100%",
    width: "100%",
    borderRadius: 100,
    zIndex: 10,
    backgroundColor: "#1c1c98",
    opacity: 0.2,
    position: "absolute",
    left: 0,
    top: 0,
  },

  profilepicOverlayDark: {
    borderColor: "#fff",
    borderWidth: 7,
    height: "100%",
    width: "100%",
    borderRadius: 100,
    zIndex: 10,
    backgroundColor: "#ffa072",
    opacity: 0.5,
    position: "absolute",
    left: 0,
    top: 0,
  },

  photoIcon: {
    zIndex: 11,
    position: "absolute",
    height: 30,
    width: 30,
    top: "40%",
    left: "40%",
  },

  editProfileTitle: {
    color: "#1C1C98",
    fontSize: 16,
    fontFamily: "Nunito-SemiBold",
  },

  editProfileTitleDark: {
    color: "#ffa072",
    fontSize: 16,
    fontFamily: "Nunito-SemiBold",
  },

  formInput: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#1C1C98",
    width: "100%",
    color: "#333",
  },

  formInputDark: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#ffa072",
    width: "100%",
    color: "#fff",
  },

  btnText: {
    color: "#fff",
    fontFamily: "Nunito-Bold",
  },

  btnSave: {
    color: "#fff",
    backgroundColor: "#1c1c98",
    padding: 13,
    alignItems: "center",
    borderRadius: 50,
    marginTop: 10,
  },

  btnSaveDark: {
    color: "#fff",
    backgroundColor: "#ffa072",
    padding: 13,
    alignItems: "center",
    borderRadius: 50,
    marginTop: 30,
  },
});
