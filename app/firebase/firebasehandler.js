import { getDatabase, ref, set, get, child } from "firebase/database";

const database = getDatabase();

export const setData = async (path, data) => {
  try {
    await set(ref(database, path), data);
    console.log("Data saved successfully!");
  } catch (error) {
    console.error("Error saving data: ", error);
  }
};

export const getData = async (path) => {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, path));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving data: ", error);
    return null;
  }
};
