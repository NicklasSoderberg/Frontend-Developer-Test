
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAbBuybkxZWHzCO5xvohZfsqtlkphBwlFQ",
  authDomain: "chucknorris-6f558.firebaseapp.com",
  projectId: "chucknorris-6f558",
  storageBucket: "chucknorris-6f558.appspot.com",
  messagingSenderId: "749638540440",
  appId: "1:749638540440:web:cf70a0dc33a6b7ef8444ed",
  measurementId: "G-597Y56L682"
};

const app = initializeApp(firebaseConfig);

export default app;