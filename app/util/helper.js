import AsyncStorage from "@react-native-async-storage/async-storage";
import { defaultItems } from "./constants";
export const getLocalStorageItem = async (object) => {
  let itemFromLocalStorage = await AsyncStorage.getItem(object);
  if (itemFromLocalStorage !== null) {
    return itemFromLocalStorage;
  } else {
    return null;
  }
};

export const getDefaultItems = (admin) => {
  defaultItems.forEach((item) => {
    item.author = admin;
  });
  return defaultItems;
};
