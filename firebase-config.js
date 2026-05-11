// firebase-config.js
// Importation des modules Firebase nécessaires
import { initializeApp }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgSwL8m8coUcU_J-IjZdEpwQvrVjj3zvg",
  authDomain: "portfolio-khoury-diop.firebaseapp.com",
  projectId: "portfolio-khoury-diop",
  storageBucket: "portfolio-khoury-diop.firebasestorage.app",
  messagingSenderId: "344516001214",
  appId: "1:344516001214:web:c64ed3318f482cb44d0def"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);