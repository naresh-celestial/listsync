import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { Platform } from "react-native";
import {
  GoogleSigninButton,
  GoogleSignin,
} from "@react-native-google-signin/google-signin";

const LoginScreen = () => {
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    if (!isWeb) {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      });
    }
  }, []);

  const handleGoogleSignInWeb = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Signed in user (Web):", user);
    } catch (error) {
      console.error("Error signing in with Google on Web:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ marginBottom: 20 }}>Sign in with Google</Text>
      {isWeb ? (
        <TouchableOpacity
          style={{
            backgroundColor: "#4285F4",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={handleGoogleSignInWeb}
        >
          <Image
            source={{
              uri: "https://developers.google.com/identity/images/g-logo.png",
            }} // Google logo URL
            style={{ width: 20, height: 20, marginRight: 10 }}
          />
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Sign in with Google (Web)
          </Text>
        </TouchableOpacity>
      ) : (
        <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={() => GoogleSignin.signIn()}
        />
      )}
    </View>
  );
};

export default LoginScreen;
