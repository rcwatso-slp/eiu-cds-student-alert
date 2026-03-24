import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCWDFx9qWI5N7H2vo0V59nCuYueuWwTjM",
  authDomain: "eiu-cds-student-alert.firebaseapp.com",
  projectId: "eiu-cds-student-alert",
  storageBucket: "eiu-cds-student-alert.firebasestorage.app",
  messagingSenderId: "496893872324",
  appId: "1:496893872324:web:d6473b6e59f69eacfa6191",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
