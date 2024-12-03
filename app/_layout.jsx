import React from "react";
import { Stack } from "expo-router"; // Use Expo Router's Stack
import { useFonts } from "expo-font";
import Loading from "../components/loading";
import { Provider as PaperProvider } from "react-native-paper";
import AuthGuard from "./navigation/AuthGuard"; // Ensure AuthGuard is properly exported

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
        {/* Use Expo Router's Stack for navigation */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth/WelcomeScreen/index" />
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/login/index" />
          <Stack.Screen
            name="ListManager/index"
            options={{ title: "List Manager", headerShown: false }}
          />
          <Stack.Screen
            name="ToDoManager/index"
            options={{ title: "To Do List", headerShown: false }}
          />
          <Stack.Screen
            name="Settings/index"
            options={{ title: "Settings", headerShown: false }}
          />
        </Stack>
      </AuthGuard>
    </PaperProvider>
  );
}
