import React, { useState } from 'react';
import { Button } from '@mui/material';

const VoiceCreate = ({ setDocName }) => {
  const [isListening, setIsListening] = useState(false);

  // Function to speak a message and wait for it to finish before starting recognition
  const speak = (message, callback) => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.onend = () => {
      if (callback) {
        callback();  // Start listening after speaking has finished
      }
    };
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

      // Set the document name based on the user's voice input
      setDocName(transcript);  // Pass the spoken name to CreateDocument
      speak(`You have named the document: ${transcript}`);
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

  // Handle the button click to start voice recognition
  const handleVoiceInput = () => {
    speak('What is the name of the document?', startListening);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleVoiceInput}>
        Voice Assistant
      </Button>
    </div>
  );
};

export default VoiceCreate;
