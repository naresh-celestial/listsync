import { doc, getDoc, setDoc } from "firebase/firestore";

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
    console.log(err);
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
    console.log(err);
  }
};

export const createNotes = async (note) => {
  try {
    if (note.uid) {
      await setDoc(doc(db, "notes", note.uid), {
        uid: note.uid,
        title: note.title,
        description: note.description,
        favourite: note.favourite,
        category: note.category,
        author: note.author,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
