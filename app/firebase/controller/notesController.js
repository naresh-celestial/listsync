import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export const getAllNotesOfUser = async (notesWithIdList) => {
  try {
    let notesDataList = [];
    if (notesWithIdList && notesWithIdList.length !== 0) {
      notesWithIdList.forEach(async (note) => {
        if (note) {
          console.log("calling note id ", note, typeof note);
          let noteData = await getNotes(note);
          if (noteData !== null) {
            notesDataList.push(noteData);
          }
        }
      });
      return new Promise((resolve, reject) => {
        if (notesDataList) {
          setTimeout(() => {
            resolve(notesDataList);
          }, 1500);
        } else {
          reject(null);
        }
      });
    }
  } catch (err) {
    console.log("Get All Notes of User Error - ", err);
  }
};

export const getNotes = async (noteId) => {
  try {
    if (noteId) {
      const noteIdRef = doc(db, "notes", noteId);
      const getNoteResp = await getDoc(noteIdRef);
      if (getNoteResp.exists()) {
        return getNoteResp.data();
      } else {
        return null;
      }
    }
  } catch (err) {
    console.log("Get Notes Error - ", err);
  }
};

export const createNotes = async (note) => {
  try {
    if (note.id) {
      console.log("42", note);
      await setDoc(doc(db, "notes", note.id), {
        uid: note.id,
        title: note.title,
        notes: note.notes,
        data: JSON.stringify(note.data),
        admin: note.admin,
        collaborators: JSON.stringify(note.collaborators),
      });
      return { message: "Success" };
    }
  } catch (err) {
    console.log("Create Notes Error - ", err);
    return { message: "Error" };
  }
};
