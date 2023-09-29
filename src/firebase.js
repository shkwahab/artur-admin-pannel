// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyC57t3NaO_MYwIYwk3bhXxXVC0FFjjw9jE",
//   authDomain: "foryou-a6f4d.firebaseapp.com",
//   projectId: "foryou-a6f4d",
//   storageBucket: "foryou-a6f4d.appspot.com",
//   messagingSenderId: "1022771984467",
//   appId: "1:1022771984467:web:a9ed97cee53b4116e6aea6",
//   measurementId: "G-B3DS4S1KW5",
// };
const firebaseConfig = {
  apiKey: "AIzaSyBxPDBLbf3o081XAntiYqEXCNekj0T-T84",
  authDomain: "artur-a4207.firebaseapp.com",
  projectId: "artur-a4207",
  storageBucket: "artur-a4207.appspot.com",
  messagingSenderId: "224429140772",
  appId: "1:224429140772:web:5f7ed903633e22117ca1b1",
  measurementId: "G-S2E1DM1LPZ"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

export { db, storage, auth, messaging };
