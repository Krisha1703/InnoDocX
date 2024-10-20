"use client";

//Firebase
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../components/firebase'; 

//React Hooks
import { useEffect } from 'react';
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

//UI Components
import { ThemeProvider } from '../components/Developer Mode/ThemeContext';

const Header = dynamic(() => import('../components/Home/Header/Header'), { ssr: false });
const Hero = dynamic(() => import('../components/Home/Hero/Hero'), { ssr: false });
const Login = dynamic(() => import('../components/Login'), { ssr: false });


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
