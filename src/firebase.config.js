import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC3QgDLTTqZUjaMPfWJJUi3StyNvoEPH_U",
  authDomain: "asignment-729ed.firebaseapp.com",
  projectId: "asignment-729ed",
  storageBucket: "asignment-729ed.appspot.com",
  messagingSenderId: "840298700913",
  appId: "1:840298700913:web:af725ff64e2af9bc75fbd0",
  measurementId: "G-XJ5DPQJ5RW",
};
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
