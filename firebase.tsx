import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCDCvfeYe_31xVgSSPssH-iMNTWHFU8U0",
  authDomain: "meta-investment.firebaseapp.com",
  projectId: "meta-investment",
  storageBucket: "meta-investment.firebasestorage.app",
  messagingSenderId: "864408628755",
  appId: "1:864408628755:web:a7bc93182ee117c80ad9e6",
  measurementId: "G-WT64NZ8BYL"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
