import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic from Next.js
import useAppState from '../../useAppState';
import { Button } from '@mui/material';

const DynamicCreateDocument = dynamic(() => import('./CreateDocument'), { ssr: false });

const VoiceAssistant = () => {
  const { session, showModal, setShowModal } = useAppState();
  const [isListening, setIsListening] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false); // State to check if running in the browser

  // Function to speak a message
  const speak = (message) => {
    if (isBrowser) { // Only call this if running in the browser
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Function to start speech recognition
  const startListening = () => {
    if (!isBrowser) return; // Exit if not in the browser

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();

      // Check if the user said "create a new document"
      if (
        transcript.includes('create a new document') ||
        transcript.includes('create new file') ||
        transcript.includes('create new doc') ||
        transcript.includes('create document') ||
        transcript.includes('create doc') ||
        transcript.includes('want to create')
      ) {
        setShowModal(true);
        speak('Creating a new document for you.');
      } else {
        speak('I didn\'t understand that. Please say "create a new document."');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Error occurred in recognition: ' + event.error);
    };

    recognition.start();
  };

  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined');

    // Activate voice assistant when component mounts
    if (isBrowser) {
      speak(`Hello, ${session?.user?.name}, I will be assisting you today.`);
    }
  }, [session, isBrowser]); 

  return (
    <div>
      <Button variant="contained" color="primary" onClick={startListening}>
        Voice Assistant
      </Button>
  
      {showModal && (
        <DynamicCreateDocument showModal={showModal} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default VoiceAssistant;
