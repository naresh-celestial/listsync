import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export const createProfile = async (userDetails) => {
  try {
    const { email, password, uid } = userDetails;
    if ((email, password, uid)) {
      //User after Google sign in
      // await setDoc(doc(db, 'users', response.user.uid))
      await setDoc(doc(db, "users", uid), {
        uid: uid,
        email: email,
        password: password,
        notes: "[]",
      });
    }
  } catch (err) {
    console.log("Create Profile ERR - ", err);
  }
};

export const getUser = async (uid) => {
  try {
    const userId = doc(db, "users", uid);
    const getUserResp = await getDoc(userId);
    if (getUserResp.exists()) {
      return getUserResp.data();
    } else {
      return "No User Found";
    }
  } catch (err) {
    console.log(err);
  }
};

export const updateUser = async (newPayload) => {
  try {
    const userId = doc(db, "users", newPayload.uid);
    await updateDoc(userId, {
      notes: newPayload.notes,
    });
  } catch (err) {
    console.log(err);
  }
};