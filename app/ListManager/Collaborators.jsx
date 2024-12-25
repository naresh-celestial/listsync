import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Title } from "react-native-paper";

const Collaborators = () => {
  const searchParams = useLocalSearchParams();
  const list = searchParams.list; // Access id directly if available
  const [currentList, setCurrentList] = useState(JSON.parse(list));

  //router
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.navSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>{"Back"}</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.headerSection}>
          <Text style={styles.title}>{currentList.title}</Text>
        </View>
        <View style={styles.optionsSection}>
          <Text style={styles.optionsText}>O</Text>
        </View> */}
      </View>
      <View style={styles.body}>
        <View style={styles.bodyTitleSection}>
          <Title style={styles.bodyTitle}>{currentList.title}</Title>
        </View>
        <Text style={styles.textTitle}>Admin:</Text>
        <Text style={styles.textValue}>{currentList.admin}</Text>
        <View style={styles.seperator}></View>
        <Text style={styles.textTitle}>Collaborators:</Text>
        {currentList.collaborators.map((collaborator, index) => {
          return (
            <Text key={index} style={styles.textValue}>
              {index + 1}.{collaborator}
            </Text>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    fontFamily: "Rubik",
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
    fontFamily: "Rubik",
  },
  notesInput: {
    height: "80%",
    textAlignVertical: "top",
    padding: 10,
    fontFamily: "Rubik",
  },
  header: {
    flex: 0.05,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  navSection: {
    flex: 1,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  backButtonText: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "500",
    marginTop: 3,
  },
  title: {
    color: "black",
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
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
  body: {
    marginTop: 20,
    flex: 0.95,
  },
  textTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textValue: {
    backgroundColor: "white",
    elevation: 2,
    width: "100%",
    padding: 15,
    fontSize: 18,
    borderRadius: 15,
    marginTop: 5,
  },
  seperator: {
    height: 30,
  },
  bodyTitle: {
    fontSize: 35,
    fontWeight: 700,
    marginTop: 0,
    paddingTop: 5,
    height: 35,
    lineHeight: 31,
    color: "black",
  },
});

export default Collaborators;
