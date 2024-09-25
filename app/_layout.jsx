// app/_layout.jsx
import React from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import Loading from "../components/loading";
import { Provider as PaperProvider } from "react-native-paper";
import AuthGuard from "./navigation/AuthGuard";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Rubik: require("../assets/fonts/Rubik-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <PaperProvider>
      <AuthGuard>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen
            name="ListManager/index"
            options={{ title: "List Manager" }}
          />
        </Stack>
      </AuthGuard>
    </PaperProvider>
  );
}
