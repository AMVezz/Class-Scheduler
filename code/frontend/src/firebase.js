import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth"; 

const firebaseConfig = {
    apiKey: "AIzaSyDC12gjZjNQQzhDlSU8UNAu-bVjGlZcEww",
    authDomain: "class-scheduler-8c2d9.firebaseapp.com",
    projectId: "class-scheduler-8c2d9",
    storageBucket: "class-scheduler-8c2d9.firebasestorage.app",
    messagingSenderId: "1079359850401",
    appId: "1:1079359850401:web:30b8646ba95dc10cf4ede0",
    measurementId: "G-BMV69468FD"
  };
  
  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app); 
  export { auth}; 
  export default app; 