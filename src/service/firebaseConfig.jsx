// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDdOuOEYSQAIXcexVopAmuaNevPktC88NA",
    authDomain: "ai-trip-planner-89615.firebaseapp.com",
    projectId: "ai-trip-planner-89615",
    storageBucket: "ai-trip-planner-89615.appspot.com",
    messagingSenderId: "736377955147",
    appId: "1:736377955147:web:232dab0d409dc8f81e3ece",
    measurementId: "G-78YBWVLV1P"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);

//const analytics = getAnalytics(app);