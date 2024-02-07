// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyBGIMDrQmvkgag5CRrb1Ohcqi_X-KZYR50",
  authDomain: "todoapp-8407a.firebaseapp.com",
  projectId: "todoapp-8407a",
  storageBucket: "todoapp-8407a.appspot.com",
  messagingSenderId: "330760125167",
  appId: "1:330760125167:web:b513954ee3b4250d65b91a",
  measurementId: "G-RJ8E70QHLP"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db=getFirestore(app)
export const auth=getAuth(app)