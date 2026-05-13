import React, { useContext } from "react";
import { StyleSheet } from "react-native";

export function globalTheme() {}

export const globalStyles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column",
    resizeMode: "cover",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  keyboardMoveSignIn: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  logoKeyboardShow: {
    display: "none",
  },

  signInButton: {
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    margin: 0,
  },

  or: {
    color: "#fff",
    fontFamily: "Nunito-SemiBold",
    fontSize: 18,
    marginBottom: 15,
    marginTop: 15,
  },

  logoHor: {
    width: 158,
    height: 67,
    marginBottom: 50,
    alignSelf: "center",
  },

  loginTitle: {
    fontSize: 25,
    color: "#fff",
    fontFamily: "Nunito-SemiBold",
    alignSelf: "flex-start",
    marginLeft: 0,
    marginBottom: 20,
  },

  loginInput: {
    borderWidth: 1,
    borderColor: "transparent",
    borderBottomColor: "white",
    width: 300,
    color: "#fff",
    fontSize: 15,
    paddingLeft: 10,
    marginBottom: 15,
  },

  socialBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  forgotPassword: {
    color: "#FFA072",
    fontFamily: "OpenSans-Regular",
    marginTop: 15,
  },

  noAccount: {
    flexDirection: "row",
    marginTop: 15,
  },

  noAccountText: {
    color: "#fff",
    fontFamily: "OpenSans-Regular",
  },

  noAccountSignText: {
    color: "#FFA072",
    fontFamily: "OpenSans-Bold",
  },

  errorMessage: {
    color: "red",
    fontSize: 12,
    width: 300,
  },

  smallLogo: {
    width: 23,
    height: 27,
    marginTop: 10,
    alignSelf: "center",
  },

  profilePic: {
    width: 35,
    height: 35,
    borderRadius: 50,
    borderColor: "#1C1C98",
    borderWidth: 3,
  },

  profilePicDark: {
    width: 35,
    height: 35,
    borderRadius: 50,
    borderColor: "#fff",
    borderWidth: 3,
  },

  navTitle: {
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    color: "#1C1C98",
  },

  navTitleDark: {
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    color: "#fff",
  },

  goBackIcon: {
    width: 15,
    height: 30,
    marginBottom: 35,
  },

  searchIcon: {
    width: 30,
    height: 30,
  },

  navContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    borderBottomColor: "#C9C9C9",
    borderBottomWidth: 1,
  },
});
