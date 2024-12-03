import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Share,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Card,
  IconButton,
  Menu,
  Button,
  BottomNavigation,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Title } from "react-native-paper";
import BottomNavigationBar from "../navigation/BottomNavigationBar";

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
    closeMenu();
    router.push(`/ListManager/EditTodo?id=${id}`);
  };

  const handleShare = async (text) => {
    try {
      await Share.share({ message: text });
    } catch (error) {
      alert(error.message);
    }
  };

  const emailShare = (content) => {
    Linking.openURL("mailto:support@example.com", (title = { content }));
  };

  const viewCollaborators = (list) => {
    closeMenu();
    router.push(`/ListManager/Collaborators?list=${list}`);
  };

  const openMenu = (id) => {
    setVisibleMenu(id);
  };

  const closeMenu = () => {
    setVisibleMenu(null);
  };

  const goToListItems = async (data) => {
    closeMenu();
    try {
      let stringData = JSON.stringify(data);
      router.push(`/ToDoManager?item=${stringData}`);
    } catch (err) {
      console.log(err);
    }
  };

  const renderTodoItem = ({ item }) => (
    <Card style={styles.card} onPress={() => goToListItems(item)}>
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
          <Menu.Item
            onPress={() => emailShare(JSON.stringify(item))}
            title="Share"
          />
          <Menu.Item
            onPress={() => viewCollaborators(JSON.stringify(item))}
            title="Settings"
          />
        </Menu>
      </View>
    </Card>
  );

  useFocusEffect(
    useCallback(() => {
      loadTodos();
    }, [])
  );

  return (
    <>
      <View style={styles.container}>
        {/* <View style={styles.header}>
          <View style={styles.optionsSection}>
            <Text style={styles.optionsText}>0</Text>
          </View>
          <View style={styles.headerSection}>
              <Text style={styles.title}>Lists</Text>
          </View>
          <View style={styles.optionsSection}>
              <Text style={styles.optionsText}>O</Text>
          </View>
      </View> */}
        <View style={styles.body}>
          <View style={styles.bodyTitleSection}>
            <Title style={styles.bodyTitle}>My Lists</Title>
          </View>
          {todos.length !== 0 ? (
            <FlatList
              data={todos}
              keyExtractor={(item) => item.id}
              renderItem={renderTodoItem}
            />
          ) : (
            <Text style={styles.emptyListText}>No Items in the list.</Text>
          )}
          <Button
            mode="contained"
            style={styles.addButton}
            onPress={() => router.push("/ListManager/AddTodo")}
          >
            Create List
          </Button>
        </View>
      </View>
      <BottomNavigationBar page="Home" />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  },
  title: {
    color: "black",
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
  },
  bodyTitle: {
    fontSize: 35,
    marginLeft: 5,
    fontWeight: 700,
    marginTop: 15,
    paddingTop: 5,
    height: 50,
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
  body: {
    flex: 0.9,
    marginTop: 10,
  },
  card: {
    borderRadius: 0,
    height: 60,
    backgroundColor: "white",
    borderRadius: 10,
    margin: 2,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Rubik",
    paddingLeft: 20,
    paddingRight: 5,
  },
  todoText: {
    fontSize: 18,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    borderRadius: 10,
  },
  emptyListText: {
    textAlign: "center",
  },
});

export default TodoList;
