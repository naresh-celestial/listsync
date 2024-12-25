import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  updateNotesData,
  updateNotesMetaData,
} from "../firebase/controller/notesController";

const EditTodo = () => {
  const searchParams = useLocalSearchParams();
  const id = searchParams.id; // Access id directly if available
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [todos, setTodos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (id && todos.length) {
      const todo = todos.find((t) => t.uid === id);
      if (todo) {
        setTitle(todo.title);
        setNotes(todo.notes);
      }
    }
  }, [id, todos]);

  const loadTodos = async () => {
    const storedTodos = await AsyncStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  };

  const saveTodo = async () => {
    let updatedTodos;
    if (id) {
      //Update to Cloud
      let updateNotesPayload = {
        uid: id,
        title: title,
        notes: notes,
      };
      let updateNotesResp = await updateNotesMetaData(updateNotesPayload);
      if (updateNotesResp) {
        // Edit existing todo
        updatedTodos = todos.map((todo) =>
          todo.uid === id ? { ...todo, title, notes } : todo
        );
      }
    } else {
      // Add new todo
      const newTodo = { id: uuid.v4(), title, notes };
      updatedTodos = [...todos, newTodo];
    }

    await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
    router.back(); // Go back to the list after saving
  };

  const cancelTodo = () => {
    router.back(); // Go back to the list after saving
  };

  const Separator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <Text style={styles.bodyTitle}>Edit List</Text>
      <View style={styles.body}>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Notes"
          value={notes}
          onChangeText={setNotes}
          style={[styles.input, styles.notesInput]}
          multiline
        />
        <View style={styles.actionButtonContainer}>
          <Pressable style={styles.actionButton} onPress={saveTodo}>
            <Text style={styles.actionButtonText}>
              {id ? "Save" : "Add New"}
            </Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={cancelTodo}>
            <Text style={styles.actionButtonText}>Cancel</Text>
          </Pressable>
        </View>

        {/* <Button title={id ? "Save Changes" : "Add Todo"} onPress={saveTodo} />
        <Separator />
        <Button title="Cancel" onPress={cancelTodo} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  notesInput: {
    height: "60%",
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

export default EditTodo;
