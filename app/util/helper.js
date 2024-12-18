export const getLocalStorageItem = async (object) => {
  let itemFromLocalStorage = await localStorage.getItem(object);
  if (itemFromLocalStorage !== null) {
    return itemFromLocalStorage;
  } else {
    return null;
  }
};
