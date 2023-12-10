import { initializeApp } from 'firebase/app';



const firebaseConfig = {
    apiKey: "AIzaSyDkRucwgjMCjRYDZWEV9SwPc19jdbr76IE",
    authDomain: "localhost:9090",
    // authDomain: "https://ochuba.com",
    // authDomain: "ochuba.firebaseapp.com",
    projectId: "ochuba",
    storageBucket: "ochuba.appspot.com",
    messagingSenderId: "655257267739",
    appId: "1:655257267739:web:e666ace6efd053865692be",
    measurementId: "G-0QQ3V70RMT", // Optional
    // appVerificationDisabledForTesting: true,
  };

  export const app = initializeApp(firebaseConfig);