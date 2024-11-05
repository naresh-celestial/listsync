import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "./Colors";

const { width, height } = Dimensions.get("window");

export const AuthFlowStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.buttonBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  circle1: {
    position: "absolute",
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: (width * 0.75) / 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -height * 0.15,
    right: -width * 0.25,
  },
  circle2: {
    position: "absolute",
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: (width * 0.5) / 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    bottom: height * 0.1,
    left: -width * 0.2,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    marginBottom: "40%",
    width: width * 0.9,
  },
  title: {
    fontFamily: "Rubik",
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.light.buttonText,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Rubik",
    color: Colors.light.whiteText,
    width: "90%",
    marginBottom: 20,
  },
  signInButton: {
    width: "100%",
    backgroundColor: Colors.light.buttonText,
    borderRadius: 25,
    paddingVertical: 12,
    marginBottom: 20,
    boxShadow: "0px 2px 3.84px rgba(0, 0, 0, 0.25)",
    elevation: 5,
    alignItems: "center",
  },
  signInButtonGoogle: {
    width: "100%",
    backgroundColor: Colors.light.buttonText,
    borderRadius: 25,
    // paddingVertical: 12,
    marginBottom: 20,
    boxShadow: "0px 2px 3.84px rgba(0, 0, 0, 0.25)",
    color: Colors.light.text,
    elevation: 5,
    alignItems: "center",
  },
  signInButtonText: {
    color: Colors.light.buttonBackground,
    fontSize: 16,
    fontWeight: "bold",
  },
  createAccountButton: {
    width: "100%",
    borderColor: Colors.light.buttonText,
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  createAccountButtonText: {
    color: Colors.light.buttonText,
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomLink: {
    marginTop: 30,
    marginRight: 20,
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  bottomLinkText: {
    fontSize: 14,
    color: Colors.light.buttonText,
  },
  signInLink: {
    fontWeight: "bold",
    color: Colors.light.buttonText,
  },
});
