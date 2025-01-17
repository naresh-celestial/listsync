import { Link, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ToastAndroid,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../../constants/Colors";
import {
  getAllNotesOfUser,
  getNotes,
} from "../../firebase/controller/notesController";
import {
  createProfile,
  getUser,
} from "../../firebase/controller/userController";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const saveUserLogin = async (userLogin) => {
    if (userLogin) {
      await AsyncStorage.setItem("user", JSON.stringify(userLogin));
    }
  };

  const validateCredentials = (email, password) => {
    if (email && password) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email)) {
        // Check password availability and criteria
        if (password && typeof password === "string" && password.length >= 6) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  };

  //Replace this function with GCC UID
  const generateUserId = (email) => {
    if (email) {
      if (!email || typeof email !== "string") {
        throw new Error("A valid email is required to generate a user ID.");
      }
      const emailPrefix = email.split("@")[0];

      const randomNumber = Math.floor(10000 + Math.random() * 90000);

      const userId = `${emailPrefix}${randomNumber}`;

      return userId;
    }
  };

  const handleLogin = async () => {
    try {
      if (email && password) {
        if (validateCredentials(email, password)) {
          //call firebase method to set this if new user
          //Login User
          let currentUser = await getUser("VQdX2v9h6n4AOhwY06lg");

          if (currentUser) {
            let userNotes = await getAllNotesOfUser(
              JSON.parse(currentUser.notes)
            );
            if (userNotes && userNotes.length !== 0) {
              await AsyncStorage.setItem("todos", JSON.stringify(userNotes));
            } else {
              await AsyncStorage.setItem("todos", JSON.stringify([]));
            }
            const { email, password, notes, uid } = currentUser;
            await saveUserLogin({
              email: email,
              password: password,
              uid: uid,
              notes: JSON.parse(notes),
            });
            router.replace("ListManager");
          }
        } else {
          alert("Please enter credentials");
        }
      } else {
        alert("Please enter credentials");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const checkIsUserAvailable = async () => {
      let userObject = await AsyncStorage.getItem("user");
      if (userObject) {
        ToastAndroid.show("Welcome", ToastAndroid.SHORT);
        router.replace("ListManager");
        // console.log("user available", userObject);
      }
    };
    checkIsUserAvailable();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0047cc" barStyle="light-content" />
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>
          Manage your expenses seamlessly & intuitively
        </Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.inputField}
          placeholderTextColor="black"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.inputField}
          placeholderTextColor="black"
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.createAccountButtonText}>LOGIN</Text>
        </TouchableOpacity>

        {/* Bottom Link */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.bottomLink}
        >
          <Text style={styles.bottomLinkText}>
            Sign in with Social Account ?
          </Text>
          <Text style={styles.signInLink}>Google Sign in</Text>
        </TouchableOpacity>
      </View>

      {/* <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("auth/WelcomeScreen")}
      >
        <Text style={styles.backButtonText}>{"< Back"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} /> */}
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
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
  inputField: {
    width: "100%",
    borderColor: Colors.light.buttonText,
    borderWidth: 0.5,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#ffffff90",
    color: "black",
    fontWeight: "700",
    paddingLeft: 20,
    marginBottom: 20,
  },
  loginButton: {
    width: "100%",
    borderColor: Colors.light.buttonText,
    borderWidth: 0.5,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#ffffff",
    color: "black",
    fontWeight: "700",
    marginBottom: 20,
  },
  createAccountButtonText: {
    color: "black",
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
  // title: {
  //   fontSize: 24,
  //   textAlign: "center",
  //   marginBottom: 20,
  // },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007BFF",
  },
});

export default LoginScreen;
