// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6lemXvddyXrBC6rePvWHApKE4UYfwZIY",
  authDomain: "eduplanner-231a4.firebaseapp.com",
  projectId: "eduplanner-231a4",
  storageBucket: "eduplanner-231a4.firebasestorage.app",
  messagingSenderId: "896337291318",
  appId: "1:896337291318:web:923c01fbd99e7b70a75097"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export const db = getFirestore(appFirebase);

export default appFirebase;