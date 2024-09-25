import React, { useLayoutEffect } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleDarkModeToggle = () => {
    setDarkModeEnabled(!darkModeEnabled);
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarIcon: ({ color, size }) => (
        <ListIcon name="list" color={color} size={size} />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleNotificationsToggle}
        />
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Dark Mode</Text>
        <Switch value={darkModeEnabled} onValueChange={handleDarkModeToggle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
  },
});

export default SettingsScreen;
