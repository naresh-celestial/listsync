import { StyleSheet } from "react-native";
import { Colors } from "./Colors";

const headerStyles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.light.buttonBackground,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginTop: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  subTitle: {
    color: "white",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginTop: 15,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#424242",
    marginLeft: 5,
  },

  iconColor: {
    color: "white",
  },
});

export default headerStyles;
