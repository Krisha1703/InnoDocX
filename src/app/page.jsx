"use client";
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { db } from '../components/firebase';  // Import your initialized Firestore
import Header from "../components/Header";
import CreateDoc from "../components/CreateDoc";
import Login from "../components/Login";
import { useEffect } from 'react';

import { useSession } from "next-auth/react";

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
    <main className="">
      <Header />
      <CreateDoc />
 
    </main>
  );
}
