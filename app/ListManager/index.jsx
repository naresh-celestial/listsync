import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Share, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, IconButton, Menu, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [visibleMenu, setVisibleMenu] = useState(null);
  const router = useRouter();

  const loadTodos = async () => {
    const storedTodos = await AsyncStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  };

  const saveTodos = async (newTodos) => {
    await AsyncStorage.setItem("todos", JSON.stringify(newTodos));
    setTodos(newTodos);
  };

  const handleDelete = (id) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    saveTodos(filteredTodos);
  };

  const handleEdit = (id) => {
    router.push(`/ListManager/EditTodo?id=${id}`);
  };

  const handleShare = async (text) => {
    try {
      await Share.share({ message: text });
    } catch (error) {
      alert(error.message);
    }
  };

  const openMenu = (id) => {
    setVisibleMenu(id);
  };

  const closeMenu = () => {
    setVisibleMenu(null);
  };

  const renderTodoItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.todoText}>{item.title}</Text>
        {/* <Text style={styles.todoText}>{item.notes}</Text> */}
        <Menu
          visible={visibleMenu === item.id}
          onDismiss={closeMenu}
          anchor={
            <IconButton
              icon="dots-vertical"
              onPress={() => openMenu(item.id)}
            />
          }
        >
          <Menu.Item onPress={() => handleEdit(item.id)} title="Edit" />
          <Menu.Item onPress={() => handleDelete(item.id)} title="Delete" />
          <Menu.Item onPress={() => handleShare(item.text)} title="Share" />
        </Menu>
      </View>
    </Card>
  );

  useFocusEffect(
    useCallback(() => {
      loadTodos();
    }, [])
  );

  console.log("todos", todos);

  return (
    <View style={styles.container}>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={renderTodoItem}
      />
      <Button
        mode="contained"
        style={styles.addButton}
        onPress={() => router.push("/ListManager/AddTodo")}
      >
        Add Todo
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    fontFamily: "Rubik",
  },
  card: {
    marginBottom: 10,
    borderRadius: 0,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Rubik",
    padding: 10,
  },
  todoText: {
    fontSize: 18,
  },
  addButton: {
    marginTop: 20,
  },
});

export default TodoList;
