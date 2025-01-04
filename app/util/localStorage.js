import AsyncStorage from "@react-native-async-storage/async-storage";

export const setToLocalStorage = async (data, listMetaData) => {
  try {
    const storedTodos = await AsyncStorage.getItem("todos");
    const parsedTodos = JSON.parse(storedTodos) || [];

    const index = parsedTodos.findIndex(
      (list) => list.uid === listMetaData.uid
    );
    if (index >= 0) parsedTodos[index].data = data;

    await AsyncStorage.setItem("todos", JSON.stringify(parsedTodos));
  } catch (error) {
    console.error("Error saving to local storage:", error);
  }
};
