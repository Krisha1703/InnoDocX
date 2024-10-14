import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAwAkNPDEDugEUjDDmMqXrdR-mwDwjn_Eg",
  authDomain: "docs-clone-69bb6.firebaseapp.com",
  projectId: "docs-clone-69bb6",
  storageBucket: "docs-clone-69bb6.appspot.com",
  messagingSenderId: "155261813926",
  appId: "1:155261813926:web:6d11d05ac70feff3dbe067",
  measurementId: "G-73623X480L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

