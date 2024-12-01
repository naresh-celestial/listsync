import { Link, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const saveUserLogin = async (userLogin) => {
    if (userLogin) {
      console.log("user login", userLogin);
      await AsyncStorage.setItem("user", JSON.stringify(userLogin));
    }
  };

  const handleLogin = async () => {
    try {
      if (email && password) {
        // console.log("Logging in", email, password);
        await saveUserLogin({ email: email, password: password });
        // navigation.navigate("ToDo"); // Replace so user can’t go back to login
        router.replace("ListManager");
      } else {
        alert("Please enter credentials");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
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
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
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
