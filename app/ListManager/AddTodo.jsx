import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Divider } from "react-native-paper";
import { createNotes } from "../firebase/controller/notesController";
import { getDefaultItems } from "../util/helper";
import { updateUser } from "../firebase/controller/userController";

const AddTodo = () => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const router = useRouter();

  const saveTodo = async () => {
    if (title.length !== 0 && notes.length !== 0) {
      const storedTodos = await AsyncStorage.getItem("todos");
      const savedUser = await AsyncStorage.getItem("user");
      let userObject = JSON.parse(savedUser);
      let todos = storedTodos ? JSON.parse(storedTodos) : [];

      if (userObject) {
        console.log("30", userObject);
        const { uid, email } = userObject;
        let defaultItems = getDefaultItems(email);

        const newTodo = {
          id: Date.now().toString(),
          title,
          notes,
          data: JSON.stringify(defaultItems),
          admin: email,
          collaborators: [email],
        };

        //Create the Notes in Cloud
        await createNotes(newTodo);

        //update the notes Id to user in Cloud
        userObject.notes.push(newTodo.id);
        await updateUser({ uid: uid, notes: JSON.stringify(userObject.notes) });
        if (todos.length !== 0) {
          todos.push(newTodo);
        } else {
          todos = [newTodo];
        }

        // const updatedTodos = [...todos, newTodo];
        await AsyncStorage.setItem("todos", JSON.stringify(todos));
        await AsyncStorage.setItem("user", JSON.stringify(userObject));
        router.back(); // Go back to the list after saving
      }
    } else {
      alert("Please enter all fields");
    }
  };

  const cancelTodo = () => {
    router.back(); // Go back to the list after saving
  };

  const Separator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <Text style={styles.bodyTitle}>Create List</Text>
      <View style={styles.body}>
        <TextInput
          placeholder="Enter List Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Enter List Notes"
          value={notes}
          onChangeText={setNotes}
          style={[styles.input, styles.textArea]}
          multiline
        />
        <View style={styles.actionButtonContainer}>
          <Pressable style={styles.actionButton} onPress={saveTodo}>
            <Text style={styles.actionButtonText}>Save</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={cancelTodo}>
            <Text style={styles.actionButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 8,
    fontFamily: "Rubik",
  },
  textArea: {
    height: "40%",
    textAlignVertical: "top",
    padding: 10,
    fontFamily: "Rubik",
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  body: {
    width: "100%",
    marginTop: 10,
  },
  bodyTitle: {
    fontSize: 35,
    marginLeft: 5,
    fontWeight: "bold",
    marginTop: 15,
    paddingTop: 5,
    height: 50,
  },
  actionButtonContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    paddingLeft: 35,
    paddingRight: 35,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007BFF",
    margin: 10,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
});

export default AddTodo;
