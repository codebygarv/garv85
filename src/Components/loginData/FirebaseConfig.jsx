import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDR_ekW85HbqOTNfmYpoX66jjtLeaSi10g",
    authDomain: "to-do-list-77e52.firebaseapp.com",
    projectId: "to-do-list-77e52",
    storageBucket: "to-do-list-77e52.appspot.com",
    messagingSenderId: "888913523349",
    appId: "1:888913523349:web:b3188c1b427fb3508d219c",
    measurementId: "G-YMW4WB5ZKP"
};

const app = initializeApp(firebaseConfig);
export const database = getAuth(app);