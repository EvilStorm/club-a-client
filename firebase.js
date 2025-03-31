import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase 설정 (Firebase 콘솔에서 가져온 값으로 변경)
const firebaseConfig = {
  apiKey: "AIzaSyAZXm1gBP_2xb6Nn30ws9aB9k7q0BjxDt0",
  authDomain: "club-activity-30c77.firebaseapp.com",
  projectId: "club-activity-30c77",
  storageBucket: "club-activity-30c77.firebasestorage.app",
  messagingSenderId: "775971891707",
  appId: "1:775971891707:web:82542914ff6b3294c2435e",
  measurementId: "G-JKD5R5J4WK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();