import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import GoogleSignInScreen from "../GoogleSignInScreen";

const { width, height } = Dimensions.get("window");

const WelcomeScreen = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0047cc" barStyle="light-content" />

      <View style={styles.circle1} />
      <View style={styles.circle2} />

      {/* Welcome Section */}
      <View style={styles.content}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Manage your expenses seamlessly & intuitively
        </Text>

        {/* Sign in Button */}
        {/* <TouchableOpacity
          style={styles.signInButton}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.signInButtonText}>Sign in with Google</Text>
        </TouchableOpacity> */}

        <GoogleSignInScreen />
        {/* Create Account Button */}
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.createAccountButtonText}>Create an account</Text>
        </TouchableOpacity>

        {/* Bottom Link */}
        <TouchableOpacity
          onPress={() => router.push("/auth/login")}
          style={styles.bottomLink}
        >
          <Text style={styles.bottomLinkText}>
            Already have an account?{" "}
            <Text style={styles.signInLink}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0047cc", // Blue background
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
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Rubik",
    color: "#FFFFFF",
    width: "90%",
    marginBottom: 20,
  },
  signInButton: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingVertical: 12,
    marginBottom: 20,
    boxShadow: "0px 2px 3.84px rgba(0, 0, 0, 0.25)", // Updated to box shadow
    elevation: 5,
    alignItems: "center",
  },
  signInButtonText: {
    color: "#0047cc",
    fontSize: 16,
    fontWeight: "bold",
  },
  createAccountButton: {
    width: "100%",
    borderColor: "#FFFFFF",
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
  },
  createAccountButtonText: {
    color: "#FFFFFF",
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
    color: "#FFFFFF",
  },
  signInLink: {
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default WelcomeScreen;
