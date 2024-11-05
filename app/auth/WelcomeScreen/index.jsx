import React from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import GoogleSignInScreen from "../GoogleSignInScreen";
import { AuthFlowStyles as styles } from "../../../constants/AuthFlowStyles";

const WelcomeScreen = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0047cc" barStyle="light-content" />

      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <View style={styles.content}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Manage your expenses seamlessly & intuitively
        </Text>

        <TouchableOpacity
          style={styles.signInButtonGoogle}
          // onPress={() => router.push("/auth/login")}
        >
          <GoogleSignInScreen />
        </TouchableOpacity>

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

export default WelcomeScreen;
