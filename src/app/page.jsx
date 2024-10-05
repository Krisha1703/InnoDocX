"use client";
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { db } from '../components/firebase'; 
import Header from "../components/Header";
import CreateDoc from "../components/CreateDoc";
import Login from "../components/Login";
import { useEffect } from 'react';
import { useSession } from "next-auth/react";
import { ThemeProvider } from '../components/ThemeContext';

export default function Home() {
  const { data: session } = useSession();

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

  useEffect(() => {
    if (session) {
      storeUserInFirebase();
    }
  }, [session]);

  if (!session) {
    return <Login />;
  }

  return (
    <ThemeProvider>
    <main className="">
      
      <Header />
      <CreateDoc />
 
    </main>
    </ThemeProvider>
  );
}
