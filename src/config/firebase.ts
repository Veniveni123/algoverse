import { getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbrXthYziBOXahwVqnXPjn9dYcQbzMFw0",
  authDomain: "algoverse-a21ba.firebaseapp.com",
  databaseURL: "https://algoverse-a21ba-default-rtdb.firebaseio.com",
  projectId: "algoverse-a21ba",
  storageBucket: "algoverse-a21ba.firebasestorage.app",
  messagingSenderId: "716877697899",
  appId: "1:716877697899:web:c35fe098656901cac0b22e",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth: Auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
