import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";

const EditTodo = () => {
  const searchParams = useLocalSearchParams();
  const id = searchParams.id; // Access id directly if available
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [todos, setTodos] = useState([]);
  const router = useRouter();

  console.log(id ? "Edit Todo" : "Add Todo", id);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (id && todos.length) {
      const todo = todos.find((t) => t.id === id);
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
      // Edit existing todo
      updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, title, notes } : todo
      );
    } else {
      // Add new todo
      const newTodo = { id: uuid.v4(), title, notes };
      updatedTodos = [...todos, newTodo];
    }

    await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
    router.back(); // Go back to the list after saving
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter notes"
        value={notes}
        onChangeText={setNotes}
        style={[styles.input, styles.notesInput]}
        multiline
      />
      <Button title={id ? "Save Changes" : "Add Todo"} onPress={saveTodo} />
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
});

export default EditTodo;
