import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const AddButton = ({ onPress }) => (
  <TouchableOpacity style={styles.addButton} onPress={onPress}>
    <MaterialIcons name="add" size={24} color="white" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    bottom: "10%",
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

AddButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default AddButton;
