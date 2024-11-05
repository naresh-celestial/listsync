import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const GoogleSignInScreen = () => {
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

  const handleGoogleSignInMobile = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("Signed in user (Mobile):", userInfo);
    } catch (error) {
      console.error("Error signing in with Google on Mobile:", error);
    }
  };

  return (
    <>
      {isWeb ? (
        <TouchableOpacity
          style={{
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
            }}
            style={{ width: 20, height: 20, marginRight: 10 }}
          />
          <Text style={{ color: "#000", fontWeight: "bold" }}>
            Sign in with Google
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "transparent", // Transparent background
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            elevation: 0, // Remove shadow (Android)
            shadowColor: "transparent", // Remove shadow (iOS)
          }}
          onPress={handleGoogleSignInMobile}
        >
          <Image
            source={{
              uri: "https://developers.google.com/identity/images/g-logo.png",
            }}
            style={{ width: 20, height: 20, marginRight: 10 }}
          />
          <Text style={{ color: "#000", fontWeight: "bold" }}>
            Sign in with Google
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default GoogleSignInScreen;
