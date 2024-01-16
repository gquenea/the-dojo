import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAIHbDZoDbAAknkc2PtO40Bbkz2lAPvgYM",
  authDomain: "thedojosite555.firebaseapp.com",
  projectId: "thedojosite555",
  storageBucket: "thedojosite555.appspot.com",
  messagingSenderId: "638887760553",
  appId: "1:638887760553:web:142006a567f26282da0fb8",
};

// init firebase
firebase.initializeApp(firebaseConfig);

// init services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();

// timestamp
const timestamp = firebase.firestore.Timestamp;

export { projectFirestore, projectAuth, timestamp, projectStorage };
