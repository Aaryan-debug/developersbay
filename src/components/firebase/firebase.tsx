import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {


  // Zoya's keys with salt email

  // apiKey: "AIzaSyC3uV83DFkCdIqzDRctb2nBizqqSgsLSmA",
  // authDomain: "d-hub-ec74f.firebaseapp.com",
  // projectId: "d-hub-ec74f",
  // storageBucket: "d-hub-ec74f.appspot.com",
  // messagingSenderId: "572875800850",
  // appId: "1:572875800850:web:3d96041498d06c756333cb"


  // Zoya keys with private gmail email

  apiKey: "AIzaSyDGeA_Ven54q5NbtFJ-CPbLCfWZZawGhDQ",
  authDomain: "dev-hub-9f4ea.firebaseapp.com",
  projectId: "dev-hub-9f4ea",
  storageBucket: "dev-hub-9f4ea.appspot.com",
  messagingSenderId: "191248418576",
  appId: "1:191248418576:web:c08e2c299ad9e89aaf4795"

  // Serdar's Firebase API

  // apiKey: "AIzaSyBlpujwZ91ZEtoNBD7mJJYnH0Ih4R9rV_8",
  // authDomain: "dev-hub-9dcad.firebaseapp.com",
  // databaseURL: "https://dev-hub-9dcad-default-rtdb.europe-west1.firebasedatabase.app",
  // projectId: "dev-hub-9dcad",
  // storageBucket: "dev-hub-9dcad.appspot.com",
  // messagingSenderId: "969317069452",
  // appId: "1:969317069452:web:61a5c7036b1cbd088381a9",
  // measurementId: "G-2PMPX9XVBW"


  // Deann
  // apiKey: "AIzaSyDs-ccFoyEPdhFPSimLVHZETeN26WyA0Eo",
  // authDomain: "dev-hub-cddba.firebaseapp.com",
  // databaseURL: "https://dev-hub-cddba-default-rtdb.europe-west1.firebasedatabase.app",
  // projectId: "dev-hub-cddba",
  // storageBucket: "dev-hub-cddba.appspot.com",
  // messagingSenderId: "1058247531990",
  // appId: "1:1058247531990:web:dfca5260f525ab55e65877"

};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, onAuthStateChanged }