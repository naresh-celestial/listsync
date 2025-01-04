import { View, Text, StyleSheet, Pressable } from "react-native";
import PropTypes from "prop-types";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const BottomNavigationBar = ({ page }) => {
  const router = useRouter();
  const config = [
    {
      name: "Home",
      icon: "home",
      route: "ListManager",
    },
    {
      name: "Settings",
      icon: "settings",
      route: "Settings",
    },
  ];
  const routeHandler = (item) => {
    const { route, name } = item;
    if (page !== name) {
      router.replace(route);
    }
  };
  return (
    <View style={styles.navigationContainer}>
      {config.map((route, index) => {
        const isSelected = page === route.name;
        return (
          <Pressable
            key={route.name}
            style={styles.navigationItem}
            onPress={() => routeHandler(route)}
          >
            <MaterialIcons
              name={route.icon}
              size={30}
              color={isSelected ? "blue" : "black"}
              style={styles.navigationItemIcon}
            />
            <Text
              style={[
                styles.navigationItemText,
                isSelected && { color: "blue" },
              ]}
            >
              {route.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    height: 60,
    width: "100%",
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 10,
    position: "absolute",
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  navigationItem: {
    height: 40,
    marginLeft: 40,
    marginRight: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  navigationItemIcon: {
    height: 30,
    width: 30,
  },
  navigationItemText: {
    fontSize: 12,
  },
});
BottomNavigationBar.propTypes = {
  page: PropTypes.string.isRequired,
};

export default BottomNavigationBar;
