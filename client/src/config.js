import {getStorage} from "firebase/storage"

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBawaeDcfEiioVvseXIQUsrpubceNiIVmw",
  authDomain: "uploadimage-91d29.firebaseapp.com",
  projectId: "uploadimage-91d29",
  storageBucket: "uploadimage-91d29.appspot.com",
  messagingSenderId: "68845019631",
  appId: "1:68845019631:web:e3c0f758fcdad0ed34561a"
};


const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);