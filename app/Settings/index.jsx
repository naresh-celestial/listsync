import React, { useLayoutEffect } from "react";
import { View, Text, Switch, StyleSheet, Pressable } from "react-native";
import BottomNavigationBar from "../navigation/BottomNavigationBar";
import { Title } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const SettingsScreen = () => {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleDarkModeToggle = () => {
    setDarkModeEnabled(!darkModeEnabled);
  };
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     tabBarIcon: ({ color, size }) => (
  //       <ListIcon name="list" color={color} size={size} />
  //     ),
  //   });
  // }, [navigation]);

  const logout = async () => {
    try {
      router.replace("auth/WelcomeScreen");
      await AsyncStorage.removeItem(user);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={styles.bodyTitleSection}>
            <Title style={styles.bodyTitle}>Settings</Title>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Enable Notifications</Text>
            <Switch
              thumbColor="#007BFF"
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
            />
          </View>
          {/* <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              thumbColor="#007BFF"
              value={darkModeEnabled}
              onValueChange={handleDarkModeToggle}
            />
          </View> */}
          <View style={styles.logoutSection}>
            <Pressable style={styles.logout} onPress={logout}>
              <Text style={styles.logoutText}>LOGOUT</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <BottomNavigationBar page="Settings" />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    fontFamily: "Rubik",
    backgroundColor: "#F5F5F5",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingLeft: 15,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    elevation: 2,
  },
  settingLabel: {
    fontSize: 16,
  },
  body: {
    flex: 0.9,
    marginTop: 10,
  },
  bodyTitle: {
    fontSize: 35,
    marginLeft: 5,
    fontWeight: 700,
    marginTop: 15,
    paddingTop: 5,
    height: 50,
    color: "black",
  },
  logoutSection: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logout: {
    width: "30%",
    height: 40,
    backgroundColor: "#007BFF",
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: "white",
    fontWeight: "800",
    textAlign: "center",
  },
});

export default SettingsScreen;
