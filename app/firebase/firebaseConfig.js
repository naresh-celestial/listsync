import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBa-cQpMFLnfYdOW1o46_TIxdKhf7eIqnE",
  authDomain: "list-sync-f3236.firebaseapp.com",
  projectId: "list-sync-f3236",
  storageBucket: "list-sync-f3236.firebasestorage.app",
  messagingSenderId: "990584278692",
  appId: "1:990584278692:android:264bb0fc1ef2d33c136031",
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { app, db, auth, getAuth };
