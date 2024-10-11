import {getApp, getApps, initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage}from "firebase/storage";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication

const firebaseConfig = {
  apiKey: "AIzaSyCaUHfxOBF_P6ojBbeKF0_9h4JGTUPZa1k",
  authDomain: "restaurant-app-80ba6.firebaseapp.com",
  databaseURL: "https://restaurant-app-80ba6-default-rtdb.firebaseio.com",
  projectId: "restaurant-app-80ba6",
  storageBucket: "restaurant-app-80ba6.appspot.com",
  messagingSenderId: "626301339009",
  appId: "1:626301339009:web:252c332c9a426b5f3f1480",
  measurementId: "G-J8LYKRGWCZ"
};


  const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

  const firestore = getFirestore(app);
  const storage = getStorage(app);
  const auth = getAuth(app); // Initialize Firebase Authentication

  export { app, firestore, storage, auth };