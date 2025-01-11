import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ToDoHeader = ({ title, onBack, onSearch, isSearchEnabled, ListMenu }) => {
  return (
    <View style={styles.header}>
      <View style={styles.navSection}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#007BFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.headerSection}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.optionsSection}>
        <Text style={styles.optionsText}>O</Text>
      </View>
      <View style={styles.bodyTitleSectionRightSection}>
        {!isSearchEnabled && (
          <TouchableOpacity onPress={onSearch} style={styles.searchButton}>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
        )}
        <ListMenu />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 0.05,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  navSection: {
    flex: 1,
  },
  title: {
    color: "black",
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
  },
  headerSection: {
    flex: 1,
  },
  optionsSection: {
    flex: 1,
    marginRight: 10,
    color: "black",
    opacity: 0,
  },
  optionsText: {
    textAlign: "right",
  },
  bodyTitleSectionRightSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  searchButton: {
    marginRight: 15,
  },
});

export default ToDoHeader;
