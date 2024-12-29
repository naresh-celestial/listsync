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
import { deleteNotes } from "../firebase/controller/notesController";
import { updateUser } from "../firebase/controller/userController";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
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

  const getNotesId = (notesList) => {
    let notesId = [];
    notesList.forEach((list) => {
      if (list) {
        notesId.push(list.uid);
      }
    });
    return notesId;
  };

  const goToListItems = async (data) => {
    try {
      let stringData = JSON.stringify(data);
      router.push(`/ToDoManager?item=${stringData}`);
    } catch (err) {
      console.log(err);
    }
  };

  const ListMenu = ({ listData }) => {
    const [visibleMenu, setVisibleMenu] = useState(null);

    const openMenu = (uid) => {
      setVisibleMenu(uid);
    };

    const closeMenu = () => {
      setVisibleMenu(null);
    };

    const handleDelete = async (uid) => {
      try {
        const savedUser = await AsyncStorage.getItem("user");
        let userObject = JSON.parse(savedUser);
        let filteredTodos = todos.filter((todo) => todo.uid !== uid);
        let notesIdList = getNotesId(filteredTodos);
        let udpateUserPayload = {
          uid: userObject.uid,
          notes: JSON.stringify(notesIdList),
        };
        let updateUserResp = await updateUser(udpateUserPayload);
        if (updateUserResp?.message === "success") {
          let deleteResp = await deleteNotes(uid);
          if (deleteResp?.message === "Success") {
            saveTodos(filteredTodos);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    const handleEdit = (uid) => {
      closeMenu();
      router.push(`/ListManager/EditTodo?id=${uid}`);
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

    return (
      <Menu
        visible={visibleMenu === listData.uid}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            iconColor="#000000"
            icon="dots-vertical"
            onPress={() => openMenu(listData.uid)}
          />
        }
      >
        <Menu.Item onPress={() => handleEdit(listData.uid)} title="Edit" />
        <Menu.Item onPress={() => handleDelete(listData.uid)} title="Delete" />
        <Menu.Item
          onPress={() => emailShare(JSON.stringify(listData))}
          title="Share"
        />
        <Menu.Item
          onPress={() => viewCollaborators(JSON.stringify(listData))}
          title="Settings"
        />
      </Menu>
    );
  };

  const RenderTodoItem = ({ item }) => {
    let listData = item.item;
    return (
      <Card style={styles.card} onPress={() => goToListItems(listData)}>
        <View style={styles.cardContent}>
          <Text style={styles.todoText}>{listData.title}</Text>
          <ListMenu listData={listData} />
        </View>
      </Card>
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadTodos();
    }, [])
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={styles.bodyTitleSection}>
            <Title style={styles.bodyTitle}>My Lists</Title>
          </View>
          {todos.length !== 0 ? (
            <FlatList
              data={todos}
              keyExtractor={(item) => {
                return item.uid;
              }}
              renderItem={(item) => {
                return <RenderTodoItem item={item} />;
              }}
              alwaysBounceVertical
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
    marginTop: 20,
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
    color: "black",
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
    color: "white",
  },
  emptyListText: {
    textAlign: "center",
  },
});

export default TodoList;
