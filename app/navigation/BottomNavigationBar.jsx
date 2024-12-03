import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";

const BottomNavigationBar = ({ page }) => {
  const router = useRouter();
  const config = [
    {
      name: "Home",
      filledIcon: require("../../assets/images/homeFilled.png"),
      unFilledIcon: require("../../assets/images/homeUnFilled.png"),
      route: "ListManager",
    },
    {
      name: "Settings",
      filledIcon: require("../../assets/images/settingsFilled.png"),
      unFilledIcon: require("../../assets/images/settingsUnfilled.png"),
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
        let isIconFilled = route.unFilledIcon;
        if (page === route.name) {
          isIconFilled = route.filledIcon;
        }
        return (
          <Pressable
            key={index}
            style={styles.navigationItem}
            onPress={() => routeHandler(route)}
          >
            <Image style={styles.navigationItemImage} source={isIconFilled} />
            <Text style={styles.navigationItemText}>{route.name}</Text>
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
  navigationItemImage: {
    height: 30,
    width: 30,
  },
  navigationItemText: {
    fontSize: 12,
  },
});

export default BottomNavigationBar;
