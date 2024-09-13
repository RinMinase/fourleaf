import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";

let app: null | FirebaseApp = null;
let auth: null | Auth = null;

if (
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_API_KEY
) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    databaseURL: import.meta.env.VITE_FIREBASE_DB_URL,
    authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  };

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export { auth };

export default app;
