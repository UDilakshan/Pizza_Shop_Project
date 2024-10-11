import {getApp, getApps, initializeApp} from "firebase/app";
import {getStorage}from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-J8LYKRGWCZ"
};


const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const storage = getStorage(app);

const firebaseAuth = getAuth(app);
const db = getFirestore(app);

export { app, storage,firebaseAuth, db};
