import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDeotdYyLjrcyN9PfGRp3zlt0x1iRoSQIU",
  authDomain: "whatscord-616d2.firebaseapp.com",
  projectId: "whatscord-616d2",
  storageBucket: "whatscord-616d2.firebasestorage.app",
  messagingSenderId: "453859845825",
  appId: "1:453859845825:web:af5250fbb1206607f5d640"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Build the rest of the app here:
// Google sign-in, email/password auth,
// profile setup, Firestore messages,
// realtime chat, GIF embedding.
