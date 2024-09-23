import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase'; // Import your firebase configuration

const VoiceAssistant = () => {
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState('');
  const [fileName, setFileName] = useState('');
  const [step, setStep] = useState(0); // Track steps
  const [recognition, setRecognition] = useState(null); // SpeechRecognition instance

  // Initialize speech recognition API
  const initSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support speech recognition.');
      return;
    }
    
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false; // Process single commands at a time
    recognitionInstance.interimResults = false; // Only finalize results

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      processVoiceCommand(transcript); // Pass transcript to processing function
    };
    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    setRecognition(recognitionInstance);
  };

  // Step 1: Greet the user
  const greetUser = () => {
    if (session) {
      setGreeting(`Hello ${session.user.name}, how can I assist you today?`);
      setStep(1); // Move to the next step
    }
  };

  // Process voice commands based on current step
  const processVoiceCommand = (command) => {
    if (step === 1 && command.toLowerCase().includes("create new file")) {
      setGreeting("Sure! What would you like to name the new file?");
      setStep(2); // Move to next step for filename
    } else if (step === 2) {
      provideFileName(command);
    } else {
      setGreeting("I didn't catch that. Could you repeat?");
    }
  };

  // Step 3: Provide file name
  const provideFileName = (name) => {
    setFileName(name);
    console.log('file name is: ', name)
    setGreeting(`Creating a file named "${name}"...`);
    createDocument(name); // Create the document in Firebase
  };

  // Step 4: Create document and store it in Firebase DB
  const createDocument = async (name) => {
    if (!name || !session) return;

    try {
      const docRef = doc(collection(db, 'userDocs', session.user.email, 'docs'));
      await setDoc(docRef, {
        fileName: name,
        createdAt: serverTimestamp(),
        openedAt: serverTimestamp(),
      });
      setGreeting(`Document "${name}" created successfully!`);
      setFileName(''); // Clear the input after document creation
      setStep(0); // Reset to initial state
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  // Start voice recognition for command or filename
  const startListening = () => {
    if (!recognition) return;
    recognition.start();
  };

  return (
    <div className="voice-assistant">
      <button 
        onClick={() => { 
          greetUser(); 
          initSpeechRecognition(); // Initialize speech recognition
        }} 
        className="bg-blue-500 text-white p-2 rounded"
      >
        Start Voice Assistant
      </button>

      {/* Step 1: Display greeting */}
      {greeting && <p>{greeting}</p>}

      {/* Voice command listening buttons */}
      {step === 1 && (
        <button onClick={startListening} className="bg-green-500 text-white p-2 rounded mt-2">
          Speak: "Create New File"
        </button>
      )}

      {/* Step 2: Assistant asks for file name */}
      {step === 2 && (
        <button onClick={startListening} className="bg-yellow-500 text-white p-2 rounded mt-2">
          Speak Filename
        </button>
      )}
    </div>
  );
};

export default VoiceAssistant;
