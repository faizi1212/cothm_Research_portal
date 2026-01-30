import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBgcpfvbutt4mxZp2kov3meX893-ZeObe4",
  authDomain: "cothm-portal.firebaseapp.com",
  projectId: "cothm-portal",
  storageBucket: "cothm-portal.firebasestorage.app",
  messagingSenderId: "446089110922",
  appId: "1:446089110922:web:25f6b2d32c8325ac42d473",
  measurementId: "G-353EQZJMDQ"
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { 
    auth, 
    googleProvider, 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    updateProfile
};