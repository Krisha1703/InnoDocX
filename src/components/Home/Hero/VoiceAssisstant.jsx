import React, { useEffect, useState } from 'react';
import CreateDocument from './CreateDocument';
import useAppState from '../../useAppState';
import { Button } from '@mui/material';

const VoiceAssistant = () => {
  const { session, showModal, setShowModal } = useAppState();
  const [isListening, setIsListening] = useState(false);

  // Function to speak a message
  const speak = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  };

  // Function to start speech recognition
  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log('Voice recognition activated. Speak now.');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log('You said:', transcript); // Debugging log

      // Check if the user said "create a new document"
      if (
        transcript.includes('create a new document') ||
        transcript.includes('create new file') ||
        transcript.includes('create new doc') ||
        transcript.includes('want to create')
      )
      {
        console.log('Creating document...'); // Debugging log
        setShowModal(true);
        speak('Creating a new document for you.');
      } else {
        speak('I didn\'t understand that. Please say "create a new document."');
      }
    };

    recognition.onend = () => {
      console.log('Voice recognition stopped.');
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Error occurred in recognition: ' + event.error);
    };

    recognition.start();
  };

  useEffect(() => {
    // Activate voice assistant when component mounts
    speak(`Hello, ${session?.user?.name}, I will be assisting you today.`);

    // Start listening when the user clicks the button
    startListening();

    return () => {
      // Optionally, handle cleanup here if necessary
    };
  }, [session]); // Re-run the effect if the session changes

  return (
    <div>
      <Button variant="contained" color="primary" onClick={startListening}>Voice Assistant</Button>
  
      {showModal && (
        <CreateDocument showModal={showModal} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default VoiceAssistant;
