import React, { useState } from 'react';
import { Button } from '@mui/material';

const VoiceCreate = ({ setDocName, setCategory, setCustomCategory, setDocDescription, docCategories, isCustomCategory, setIsCustomCategory }) => {
  const [isListening, setIsListening] = useState(false);
  const [step, setStep] = useState(1); // Track the current step of the process

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
  const startListening = (callback) => {
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

      callback(transcript);
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

  // Voice-based steps handler
  const handleVoiceSteps = () => {
    if (step === 1) {
      // Step 1: Ask for document name
      speak('What is the name of the document?', () => {
        startListening((transcript) => {
          setDocName(transcript);
          setStep(2); // Move to the next step
          speak(`You have named the document: ${transcript}. Now, please select the category.`);
        });
      });
    } else if (step === 2) {
      // Step 2: Ask for category
      speak('Please say a category from the list or say custom if you want to create your own.', () => {
        startListening((transcript) => {
          const chosenCategory = docCategories.find((cat) => transcript.includes(cat.toLowerCase()));
          
          if (chosenCategory) {
            setCategory(chosenCategory); // Set predefined category
            setStep(3); // Move to the next step
            speak(`Category selected: ${chosenCategory}. Now, please describe the document.`);
          } else if (transcript.includes('custom')) {
            setIsCustomCategory(true);
            setStep(4); // Move to custom category step
            speak('You have chosen a custom category. Please say the name of the custom category.');
          } else {
            // If the category is not recognized, ask again
            speak('Sorry, I did not catch that. Please choose a valid category or say custom.');
          }
        });
      });
    } else if (step === 4) {
      // Step 4: Custom category input
      speak('Please say the name of the custom category.', () => {
        startListening((transcript) => {
          setCustomCategory(transcript); // Set custom category
          setStep(3); // Move to the next step
          speak(`Custom category set to: ${transcript}. Now, please describe the document.`);
        });
      });
    } else if (step === 3) {
      // Step 3: Ask for document description
      speak('Please describe the document.', () => {
        startListening((transcript) => {
          setDocDescription(transcript); // Set the document description
          speak(`Document description set to: ${transcript}. Document creation is complete.`);
        });
      });
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleVoiceSteps}>
        Voice Assistant
      </Button>
    </div>
  );
};

export default VoiceCreate;
