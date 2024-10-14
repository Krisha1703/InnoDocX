"use client";

//Firebase
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../components/firebase'; 

//React Hooks
import { useEffect } from 'react';
import { useSession } from "next-auth/react";

//UI Components
import { ThemeProvider } from '../components/Developer Mode/ThemeContext';
import Header from "../components/Home/Header/Header";
import Hero from "../components/Home/Hero/Hero";
import Login from "../components/Login";

export default function Home() {
  const { data: session } = useSession(); //User session data

  //Store the authenticated user's details in Firebase Firestore when a user session is active
  const storeUserInFirebase = async () => {
    if (session) {
      try {
        const userDocRef = doc(db, 'users', session.user.email);
        await setDoc(userDocRef, {
          name: session.user.name,
          email: session.user.email,
          image: session.user.image
        }, { merge: true });
      } catch (error) {
        console.error("Error storing user in Firebase:", error);
      }
    }
  };

  //If session active then store user information in firebase
  useEffect(() => {
    if (session) {
      storeUserInFirebase();
    }
  }, [session]);

  //If there is no active session, then render Login component
  if (!session) {
    return <Login />;
  }

  return (
    <ThemeProvider>
      <Header />
      <Hero />
    </ThemeProvider>
  );
}
