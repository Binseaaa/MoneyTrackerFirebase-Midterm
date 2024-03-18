import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArk9Yx4pykzoExmGD1O1o1yGZGSYmS3cg",
  authDomain: "deguma-f1258.firebaseapp.com",
  projectId: "deguma-f1258",
  storageBucket: "deguma-f1258.appspot.com",
  messagingSenderId: "1029614530954",
  appId: "1:1029614530954:web:d7a139c21ddbe5751fd873",
  measurementId: "G-2YRW35L0FT"
};

initializeApp(firebaseConfig);

const db = getFirestore();

export default db