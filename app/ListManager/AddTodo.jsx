import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const AddTodo = () => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const router = useRouter();

  const saveTodo = async () => {
    const storedTodos = await AsyncStorage.getItem("todos");
    const savedUser = await AsyncStorage.getItem("user");
    console.log("14", savedUser);
    let userObject = JSON.parse(savedUser);

    let todos = storedTodos ? JSON.parse(storedTodos) : [];
    const newTodo = {
      id: Date.now().toString(),
      title,
      notes,
      data: [],
      admin: userObject.email,
      collaborators: [userObject.email],
    };

    console.log("27", newTodo);

    if (todos.length !== 0) {
      todos.push(newTodo);
    } else {
      todos = [newTodo];
    }

    // const updatedTodos = [...todos, newTodo];
    await AsyncStorage.setItem("todos", JSON.stringify(todos));
    router.back(); // Go back to the list after saving
  };

  return (
    <View style={styles.container}>
      <Text>Create List</Text>
      <TextInput
        placeholder="Enter your title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter your notes"
        value={notes}
        onChangeText={setNotes}
        style={[styles.input, styles.textArea]}
        multiline
      />
      <Button title="Save Todo" onPress={saveTodo} />
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
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  textArea: {
    height: 100,
  },
});

export default AddTodo;
