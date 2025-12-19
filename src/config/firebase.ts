import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBBhImobV1ED50eSvtoV0sSpBMqjH3pLF8",
    authDomain: "knowyourmechanic-32246.firebaseapp.com",
    projectId: "knowyourmechanic-32246",
    storageBucket: "knowyourmechanic-32246.firebasestorage.app",
    messagingSenderId: "1043163825972",
    appId: "1:1043163825972:web:08435e90e3f3c689534761",
    measurementId: "G-PSE3FEYJ5L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
