import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export const getAllNotesOfUser = async (notesWithIdList) => {
  try {
    let notesDataList = [];
    if (notesWithIdList && notesWithIdList.length !== 0) {
      notesWithIdList.forEach((note) => {
        if (note) {
          let noteData = getNotes(note);
          if (noteData !== null) {
            notesDataList.push(noteData);
          }
        }
      });
      return notesDataList;
    }
  } catch (err) {
    console.log("Get All Notes of User Error - ", err);
  }
};

export const getNotes = async (noteId) => {
  try {
    if (noteId) {
      const noteId = doc(db, "notes", noteId);
      const getNoteResp = await getDoc(noteId);
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
    if (note.uid) {
      await setDoc(doc(db, "notes", note.uid), {
        uid: note.uid,
        title: note.title,
        notes: note.notes,
        data: JSON.stringify(note.data),
        admin: note.admin,
        collaborators: JSON.stringify([note.collaborators]),
      });
    }
  } catch (err) {
    console.log("Create Notes Error - ", err);
  }
};
