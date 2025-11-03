
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAjedSNfhi5J6p89oSAKYu987cPNAo1SOE",
  authDomain: "cosmoscope-fc162.firebaseapp.com",
  projectId: "cosmoscope-fc162",
  storageBucket: "cosmoscope-fc162.firebasestorage.app",
  messagingSenderId: "238343973751",
  appId: "1:238343973751:web:5c663583e2123aec854f72",
  measurementId: "G-46WYCG9GBR",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
